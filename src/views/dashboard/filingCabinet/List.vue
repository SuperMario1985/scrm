<template>
	<div class="list" ref="List">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;">
				<!-- 左侧 -->
				<a-layout-sider>
					<!-- 公众号 -->
					<FileMenu @changeGroupId='changeGroupId' ref="filemenu"></FileMenu>
				</a-layout-sider>
				<a-layout
						style="position: absolute;left:250px;top:0;bottom:0;right:0;overflow-x: hidden; overflow-y: auto;"
						class="scroll fans-content"
				>
					<!--添加到企微侧边栏弹窗-->
					<a-layout-content>
						<div style="font-size:16px;font-weight:700;color:#333333">内容引擎</div>
					<a-modal v-model="sidebarVisible" title="添加到企微侧边栏">
						<template slot="footer">
							<a-upload
									name="file"
									:multiple="true"
									action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
									@change="handleSidebarCancel"
									:beforeUpload="beforeUpLoadInfo"
									:customRequest="selfUpLoadInfo"
							>
								<a-button>
									<a-icon type="upload"/>
									上传文件
								</a-button>
							</a-upload>
							<a-button type="primary" @click="handleSidebarOk">
								查看使用教程
							</a-button>
						</template>
						<p>Some contents...</p>
					</a-modal>
					<div class="content-msg" style="box-shadow: 0px 1px 4px 0px #D7D7D7;padding:16px">
						<p style="margin-bottom: 2px;">
							1、本系统仅支持创建单图文。
						</p>
						<p style="margin-bottom: 2px;">
							2、同步公众号单图文/多图文的区别：
						</p>
						<p style="margin-bottom: 2px;">
							从某公众号同步过来的多图文，仅适用于在该公众号下进行发送，亦不可在企业微信里进行发送；而同步过来的单图文，可以在任何公众号和企业微信里发送。
						</p>
						<p style="margin-bottom: 2px;">
							3、对于同步到本系统的单/多图文，在本系统修改或是删除后，公众号均会保持实时一致。
						</p>
						<p style="margin-bottom: 2px;">
							4、上传要求与发送限制
							<a-tooltip placement="right" style="margin-left: 5px;">
								<template slot="title">
									<li style="margin-bottom: 2px;">
										图片（image）：2MB，支持JPG、JPEG及PNG格式。
									</li>
									<li style="margin-bottom: 2px;">
										语音（voice）：2MB，播放长度不超过60s，支持AMR、MP3格式。对公众号发送消息，可对该两种格式均可支持；而对企业微信发送，仅支持AMR格式。
									</li>
									<li style="margin-bottom: 2px;">
										视频（video）：10M，支持MP4格式。
									</li>
									<li style="margin-bottom: 2px;">
										普通文件（file）：20MB，支持DOC、DOCX、XLS、XLSX、CSV、PPT、PPTX、TXT、PDF及Xmind格式。仅应用于企业侧边栏模块发送。
									</li>
								</template>
								<a-icon type="question-circle" style="vertical-align: inherit;"></a-icon>
							</a-tooltip>
						</p>
						<p style="margin-bottom: 2px;">
							5、在企业微信和公众号，分别每创建一个渠道码，该码则自动进入【内容引擎】--【图片类型】--分组【渠道码-企业微信/公众号】，以素材的方式通过聊天侧边栏快速发送给客户。
						</p>
						<p style="margin-bottom: 2px;">
							6、其他分组不可移入至【渠道码】分组里，但【渠道码】里的分组可以移入至其他分组里。
						</p>
						<p style="margin-bottom: 0px; color: #ff562d">
							7、通过聊天侧边栏发送小程序，员工请先将企业微信APP升级至3.1.0及以后版本，小程序路径必须以“.html”结尾。
						</p>
					</div>
					<!-- 内容 -->
				
						<!-- 表格部分 -->
						<div class="content-bd">
							<div class="account-filter">
								<div class="account-filter-contain">
									<div v-show="!isMoveType" class="account-filter-item" @click="callback ('0')"
									     :class="material_type == 0?'active':''"
									     style="min-width: 20px;border-left: 0px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											所有
										</p>
									</div>
									<div v-show="!isMoveType" class="account-filter-item" @click="callback ('6')"
									     :class="material_type == 6?'active':''"
									     style="min-width: 20px;border-left: 0px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											文本
										</p>
									</div>
									<div class="account-filter-item" @click="callback ('1')"
									     :class="material_type == 1?'active':''"
									     style="min-width: 20px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											图片
										</p>
									</div>
									<div v-show="!isMoveType" class="account-filter-item" @click="callback ('4')"
									     :class="material_type == 4?'active':''"
									     style="min-width: 20px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											图文
										</p>
									</div>
									<div v-show="!isMoveType" class="account-filter-item" @click="callback ('2')"
									     :class="material_type == 2?'active':''"
									     style="min-width: 20px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											音频
										</p>
									</div>
									<div v-show="!isMoveType" class="account-filter-item" @click="callback ('3')"
									     :class="material_type == 3?'active':''"
									     style="min-width: 20px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											视频
										</p>
									</div>
									<div v-show="!isMoveType" class="account-filter-item" @click="callback ('7')"
									     :class="material_type == 7?'active':''"
									     style="min-width: 20px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											小程序
										</p>
									</div>
									<div v-show="!isMoveType" class="account-filter-item" @click="callback ('5')"
									     :class="material_type == 5?'active':''"
									     style="min-width: 20px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											文件
										</p>
									</div>

								</div>
							</div>
							<a-spin tip="Loading..." size="large" :spinning="isLoading">

								<!-- 图文 -->
								<div v-show="material_type == 4">
									<div style="height: 32px;padding-left: 20px; margin-bottom:10px;display: inline-block;line-height: 32px;">
										<a-tooltip placement="top">
											<template slot="title">
												<span>卡片展示</span>
											</template>
											<a-icon @click="changeSketchType(0)" style="font-size: 20px;"
											        :class="sketchType == 0 ? 'sketch-type-activity' : ''"
											        type="appstore"/>
										</a-tooltip>
										<a-tooltip placement="top">
											<template slot="title">
												<span>列表展示</span>
											</template>
											<a-icon @click="changeSketchType(1)" style="font-size: 20px;margin: 0 10px;"
											        :class="sketchType == 1 ? 'sketch-type-activity' : ''"
											        type="unordered-list"/>
										</a-tooltip>
										共有
										<span style="color: blue">{{materialListTotal}}</span>个素材
									</div>
									<div class="content-hd">
										<a-input-search
												placeholder="输入要搜索的内容"
												@search="onSearch"
												v-model="name"
												:allowClear=true
												enterButton="搜索"
												style="width: 260px;"
										/>
										<a-button @click="clearInput" style="margin-left: 10px;">
											清空
										</a-button>
										<a-button style="float: right;margin-right: 10px;" icon="reload"
										          @click="showPop"
										          :loading="sketchWxLoading" v-has="'material-sync'">
											同步公众号
										</a-button>
										<a-button @click='addSketchList' style="float: right;margin-right: 10px;"
										          type="primary"
										          icon="plus" v-has="'material-add'">快速创建
										</a-button>
										<a-button @click='addFilingCabinetSketch'
										          style="float: right;margin-right: 10px;" type="primary"
										          icon="plus" v-has="'material-add'">添加图文
										</a-button>
										<!--										<a-popover v-show="sketchType == 0" placement="top">-->
										<!--											<template slot="content">-->
										<a-button @click="batchMove" style="float: right;margin-right: 10px;"
										          :disabled="selectedRowKeys.length == 0"
										          v-has="'material-remove'">
											<a-icon type="retweet"/>
											批量移动
										</a-button>
										<!--												<p @click="batchDelete" style="cursor: pointer;"-->
										<!--												   :class="selectedRowKeys.length == 0 ? 'nokey': ''"-->
										<!--												   v-has="'material-delete'">-->
										<!--													<a-icon type="delete"/>-->
										<!--													批量删除-->
										<!--												</p>-->
										<!--											</template>-->
										<!--											<a-button :disabled="selectedRowKeys.length == 0"-->
										<!--											          style="float: right;margin-right: 10px;"-->
										<!--											          v-hasMore2one="'material-remove,material-delete'">-->
										<!--												<a-icon type="diff"/>-->
										<!--												批量操作-->
										<!--											</a-button>-->
										<!--										</a-popover>-->

									</div>
									<div
											style="margin: 100px;height: 400px;text-align: center;"
											v-show="materialListTotal == 0?true:false"
									>
										<img
												src="../../../assets/null.png"
												style="width: 150px;display: block;margin: auto"
										/>
										<p style="text-align: center;">暂无数据</p>
									</div>
									<div v-show="sketchType == 0">
										<waterfall
												:col="col"
												:width="itemWidth"
												:loadDistance="200"
												:data="materialList"
												@loadmore="loadMore"
												@finish='finish'
												@scroll="scroll"
												:gutterWidth="gutterWidth"
												v-if="materialListTotal !== 0">
											<template>
												<!--											draggable="true" :id="item.id" @dragstart="drag"-->
												<div class="evenCard"
												     v-for="(item,index) in materialList" v-has="'material-list'">
													<!--单图文-->
													<a-card
															v-if="item.artList.length == 1"
															hoverable
															style="width: 90%;margin:auto;"
													>
														<div slot="title">
															<span style="font-size: 14px; width: calc(100% - 50px); display: inline-block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.create_time}}</span>
															<a-checkbox style="float: right"
															            v-hasMore2one="'material-remove,material-delete'"
															            v-model="checkBoxValue[index]"
															            @click="changeSelectKey(item.key)"></a-checkbox>
														</div>
														<img
																style="object-fit: contain;"
																:style="itemHeight"
																alt="example"
																draggable="false"
																:src="commonUrl+(item.artList[0].s_local_path || item.artList[0].local_path)"
																slot="cover"
														/>
														<template class="ant-card-actions" slot="actions">
															<!--														<a-button @click="phoneView(item.id)">-->
															<!--															<a-icon type="eye"/>-->
															<!--															手机预览-->
															<!--															手机预览-->
															<!--														</a-button>-->
															<a-tooltip placement="top" style="margin-left: 5px;"
															           v-has="'material-remove'">
																<template slot="title">
																	移动
																</template>
																<a-button type="link" @click="changeMaterial(item.id, item.group_id)"
																          v-has="'material-remove'">
																	<a-icon type="retweet"/>
																</a-button>
															</a-tooltip>
															<a-tooltip placement="top" v-if="item.is_editor==1"
															           style="margin-left: 5px;"
															           v-has="'material-preview'">
																<template slot="title">
																	预览
																</template>
																<a-button type="link" v-if="item.is_appli!=1"
																          @click="previewSketch(index)"
																          v-has="'material-preview'">
																	<a-icon type="eye"/>
																</a-button>
															</a-tooltip>
															<a-tooltip v-if="item.is_appli!=1" placement="top"
															           style="margin-left: 5px;"
															           v-has="'material-edit'">
																<template slot="title">
																	编辑
																</template>
																<a-button type="link"
																          @click="editFilingCabinetSketch(index)"
																          v-has="'material-edit'">
																	<a-icon type="edit"/>
																</a-button>
															</a-tooltip>
															<a-tooltip placement="top"
															           style="margin-left: 5px;">
																<template slot="title">
																	统计
																</template>
																<a-button type="link"
																          @click="statistic(item.id, material_type)" v-has="'content-statistic'">
																	<a-icon type="rise"/>
																</a-button>
															</a-tooltip>
														</template>
														<div
																style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px;margin-top: -47px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
														>{{item.artList[0].title}}
														</div>
														<div style="margin: 5px 0px 2px;width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
															上传者：{{item.username}}
														</div>
														<a-tooltip placement="top">
															<template slot="title">
																<span>{{item.group_name}}</span>
															</template>
															<div style="width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
																来源：{{item.group_name}}
															</div>
														</a-tooltip>

													</a-card>
													<!--多图文-->
													<a-card
															v-if="item.artList.length != 1"
															hoverable
															style="width: 90%; margin: auto;"
													>
														<div slot="title">
															<span style="font-size: 14px;width: calc(100% - 50px); display: inline-block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.create_time}}</span>
															<a-checkbox style="float: right"
															            v-hasMore2one="'material-remove,material-delete'"
															            v-model="checkBoxValue[index]"
															            @click="changeSelectKey(item.key)"></a-checkbox>
														</div>
														<template v-for="(art, artIndex) in item.artList">
															<template v-if="artIndex == 0">
																<div
																		style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px;margin-top: -47px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
																>{{art.title}}
																</div>
																<img
																		style="object-fit: contain;"
																		draggable="false"
																		alt="example"
																		:src="commonUrl+(art.s_local_path || art.local_path)"
																		slot="cover"
																/>
															</template>
															<template v-if="artIndex != 0">
																<a-card-meta :title="art.title">
																	<a-avatar
																			style="object-fit: cover;"
																			@mousedown="function(e) {e.preventDefault()}"
																			slot="avatar"
																			shape="square"
																			:size="64"
																			:src="commonUrl+(art.s_local_path || art.local_path)"
																	/>
																</a-card-meta>
															</template>
														</template>
														<template class="ant-card-actions" slot="actions">
															<!--														<a-button  @click="phoneView(item.id)">-->
															<!--															<a-icon type="eye"/>-->
															<!--															手机预览-->
															<!--														</a-button>-->
															<a-tooltip placement="top" style="margin-left: 5px;">
																<template slot="title">
																	移动
																</template>
																<a-button type="link"
																          @click="changeMaterial(item.id, item.group_id)"
																          v-has="'material-remove'">
																	<a-icon type="retweet"/>
																</a-button>
															</a-tooltip>
															<a-tooltip placement="top" style="margin-left: 5px;">
																<template slot="title">
																	编辑
																</template>
																<a-button type="link"
																          @click="editFilingCabinetSketch(index)"
																          v-has="'material-edit'">
																	<a-icon type="edit"/>
																</a-button>
															</a-tooltip>
															<a-tooltip placement="top"
															           style="margin-left: 5px;">
																<template slot="title">
																	统计
																</template>
																<a-button type="link"
																          @click="statistic(item.id, material_type)" v-has="'content-statistic'">
																	<a-icon type="rise"/>
																</a-button>
															</a-tooltip>
															<a-tooltip placement="top" style="margin-left: 5px;">
																<template slot="title">
																	删除
																</template>
																<a-button type="link" @click="delPicTxt(item.id)"
																          v-has="'material-delete'">
																	<a-icon type="delete"/>
																</a-button>
															</a-tooltip>
														</template>
														<div style="margin: 5px 0px 2px; width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
															上传者：{{item.username}}
														</div>
														<a-tooltip placement="top">
															<template slot="title">
																<span>{{item.group_name}}</span>
															</template>
															<div style="width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
																来源：{{item.group_name}}
															</div>
														</a-tooltip>

													</a-card>
												</div>
											</template>
										</waterfall>
										<a-modal title="发送手机预览" v-model="visible">
											<template slot="footer">
												<a-button key="back" @click="handleCancel">取消</a-button>
												<a-button
														key="submit"
														type="primary"
														:loading="loading3"
														@click="handleOk"
												>发送预览
												</a-button>
											</template>
											<p>关注公众号后，才能接收图文消息预览</p>
											<a-input placeholder="请输入接收预览的个人微信号（需关注）"
											         v-model="inputUsername"/>
											<div class="phoneView-txt">
												预览功能仅用于公众号查看文章效果，不适用于公众传播，预览链接会在短期内失效
											</div>
										</a-modal>
									</div>
									<div v-show="sketchType == 1">
										<a-table v-show="materialListTotal > 0" :columns="sketchColomns"
										         :dataSource="materialList"
										         :pagination="false"
										         style="margin:0 0 30px 0px;" rowKey="id"
										         :rowClassName="rowClassName"
										         v-has="'material-list'">
											<span slot="checkedBox" slot-scope="text, record,index">
												<a-checkbox style="float: right"
												            v-hasMore2one="'material-remove,material-delete'"
												            v-model="checkBoxValue[index]"
												            @click="changeSelectKey(record.key)"></a-checkbox>
											</span>
											<span slot="file_name" slot-scope="text, record,index">
												<div>
													<p style="margin-bottom: 0px;"
													   v-for="(item, index) in record.artList"><span v-if="record.artList.length && record.artList.length > 1">{{index + 1}}、</span>{{item.title}}</p>
												</div>
											</span>
											<span slot="content" slot-scope="text, record,index">
												<div style="display: inline-block; width: 100px;height: 100px;line-height: 100px;">
													<img
															style="max-width: 100px;max-height: 100px;"
															:src="commonUrl + (record.artList[0].s_local_path ? record.artList[0].s_local_path : record.artList[0].local_path)"
													/>
												</div>
											</span>
											<span slot="action" slot-scope="text, record,index">
												<a-tooltip placement="top" style="margin-left: 5px;"
												           v-has="'material-remove'">
													<template slot="title">
														移动
													</template>
													<a-button type="link" @click="changeMaterial(record.id, record.group_id)"
													          v-has="'material-remove'">
														<a-icon type="retweet"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" v-if="record.is_editor==1"
												           style="margin-left: 5px;"
												           v-has="'material-preview'">
													<template slot="title">
														预览
													</template>
													<a-button type="link" v-if="record.is_appli!=1"
													          @click="previewSketch(index)"
													          v-has="'material-preview'">
														<a-icon type="eye"/>
													</a-button>
												</a-tooltip>
												<a-tooltip v-if="record.is_appli!=1" placement="top"
												           style="margin-left: 5px;"
												           v-has="'material-edit'">
													<template slot="title">
														编辑
													</template>
													<a-button type="link"
													          @click="editFilingCabinetSketch(index)"
													          v-has="'material-edit'">
														<a-icon type="edit"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top"
												           style="margin-left: 5px;">
													<template slot="title">
														统计
													</template>
													<a-button type="link" @click="statistic(record.id, material_type)" v-has="'content-statistic'">
														<a-icon type="rise"/>
													</a-button>
												</a-tooltip>
												<a-tooltip v-if="record.is_appli!=1" placement="top"
												           style="margin-left: 5px;"
												           v-has="'material-delete'">
													<template slot="title">
														删除
													</template>
													<a-button type="link" @click="delPicTxt(record.id)"
													          v-has="'material-delete'">
														<a-icon type="delete"/>
													</a-button>
												</a-tooltip>
											</span>
										</a-table>
										<!-- 图文分页 -->
										<div style="width: 100%;padding: 0 20px 20px;" v-show="materialListTotal>0"
										     v-has="'material-list'">
											<div style="height: 32px;display: inline-block;line-height: 32px;margin-bottom: 10px;">
												<a-checkbox v-show="sketchType == 1" v-model="batchTypeValue"
												            @click="batchTypeChange"></a-checkbox>
												<a-select v-show="sketchType == 1" optionFilterProp="children"
												          v-model="batchType"
												          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
													<a-select-option value="0">选择当前页</a-select-option>
													<a-select-option value="1">选择所有</a-select-option>
												</a-select>
												<a-button @click="batchMove" style="margin-right: 5px"
												          :disabled="selectedRowKeys.length == 0"
												          v-has="'material-remove'">
													<a-icon type="retweet"/>
													批量移动
												</a-button>
												<a-button @click="batchDelete" :disabled="selectedRowKeys.length == 0"
												          v-has="'material-delete'">
													<a-icon type="delete"/>
													批量删除
												</a-button>
											</div>
											<div class="pagination" style="height: 32px;float: right;">
												<a-pagination
														:total="materialListTotal"
														showSizeChanger
														:showQuickJumper="quickJumper"
														:current="sketchPage"
														:pageSize="sketchPageSize"
														:pageSizeOptions="['15','30','50','100']"
														@change="changeSketchPage"
														@showSizeChange="showSketchSizeChange"
												/>
											</div>
										</div>
									</div>
								</div>
								<!-- 所有 -->
								<div v-if="material_type == 0">
									<div style="height: 32px;padding-left: 20px; margin-bottom:10px;display: inline-block;line-height: 32px;">
										共有
										<span style="color: blue">{{allTotal}}</span>个素材
									</div>
									<div class="content-hd">
										<a-input-search
												placeholder="输入要搜索的内容"
												@search="onSearch"
												v-model="name"
												:allowClear=true
												enterButton="搜索"
												style="width: 260px;"
										/>
										<a-button @click="clearInput" style="margin-left: 10px;">
											清空
										</a-button>
									</div>
									<div
											style="margin: 100px;height: 400px;text-align: center;"
											v-show="allTotal == 0?true:false"
									>
										<img
												src="../../../assets/null.png"
												style="width: 150px;display: block;margin: auto"
										/>
										<p style="text-align: center;">暂无数据</p>
									</div>
									<div>
										<a-table v-if="allTotal > 0" :columns="allColomns"
										         :dataSource="allMaterialList"
										         :pagination="false"
										         style="margin:0 0 30px 0px;" rowKey="id"
										         :rowClassName="rowClassName"
										         v-has="'material-list'">
											<span slot="checkedBox" slot-scope="text, record,index">
												<a-checkbox style="float: right"
												            v-hasMore2one="'material-remove,material-delete'"
												            v-model="checkBoxValue[index]"
												            @click="changeSelectKey(record.key)"></a-checkbox>
											</span>
											<span slot="content" slot-scope="text, record,index">
												<div style="height: 150px;line-height: 150px;"
												     v-if="record.file_type == 1">
													<img
															:id="record.id"
															alt="example"
															:src="commonUrl+(record.s_local_path || record.local_path)"
															slot="cover"
															style="max-width: 100px; max-height: 100px;"
															@click="previewPic1(index)"
													/>
												</div>
												<div style="height: 80px;line-height: 40px;"
												     v-if="record.file_type == 2">
													<div class="audio">
														<div class="box" @click="playMusicByAll(index, true)"
														     style="float: left;"
														     v-show="clickIndex != index">
															<div class="wifi-symbol">
																<div class="wifi-circle first"></div>
																<div class="wifi-circle second"></div>
																<div class="wifi-circle third"></div>
															</div>
															<audio :name="index" :data-index="index"
															       @canplay="oncanplay">
																<source
																		:src="commonUrl+record.local_path"
																		type="audio/mpeg"
																/>
															</audio>
														</div>
														<div class="box" v-show="clickIndex == index"
														     style="float: left"
														     @click="playMusicByAll(index, false)">
															<div class="wifi-symbol">
																<div class="wifi-circle first"></div>
																<div class="wifi-circle second1"></div>
																<div class="wifi-circle third1"></div>
															</div>
														</div>
													</div>
													<div style="text-align: left;padding: 0 5px;">{{playTime[index] | dateFormat}}</div>
												</div>
												<div style="height: 115px;line-height: 115px;"
												     v-if="record.file_type == 3">
													<video-player
															class="video-player vjs-custom-skin"
															ref="videoPlayer"
															style="width: 200px;"
															:playsinline="true"
															:options="playerOptions[index]"
													></video-player>
												</div>
												<div style="height: 150px;line-height: 150px;"
												     v-if="record.file_type == 4">
													<div style="display: inline-block; width: 100px;height: 100px;line-height: 100px;">
														<img
																style="max-width: 100px;max-height: 100px;"
																:src="commonUrl + (record.artList[0].s_local_path ? record.artList[0].s_local_path : record.artList[0].local_path)"
														/>
													</div>
												</div>
												<div style="height: 150px;line-height: 150px;"
												     v-if="record.file_type == 5">
													--
												</div>
												<div style="height: 150px;line-height: 30px;"
												     v-if="record.file_type == 6">
													<a-popover>
													    <template slot="content">
													        <p style="max-width: 700px;word-break:break-all;word-wrapL:break-word;" v-html="text.replace(/\n/g, '<br/>')"></p>
													    </template>
													    <div class="inputTitle2">
															<p v-html="text.replace(/\n/g, '<br/>')"></p>
														</div>
													</a-popover>
<!--													<div class="inputTitle2">-->
<!--														<p v-html="text.replace(/\n/g, '<br/>')"></p>-->
<!--													</div>-->
												</div>
												<div style="height: 150px;line-height: 150px;"
												     v-if="record.file_type == 7">
													<img
															:id="record.id"
															alt="example"
															:src="commonUrl+(record.s_local_path || record.local_path)"
															slot="cover"
															style="max-width: 100px; max-height: 100px;"
													/>
												</div>
											</span>
											<span slot="file_name" slot-scope="text, record,index">
												<div v-if="record.file_type != 4">{{record.file_name}}</div>
												<div v-if="record.file_type == 4">
													<p style="margin-bottom: 0px;"
													   v-for="(item, index) in record.artList"><span v-if="record.artList.length && record.artList.length > 1">{{index + 1}}、</span>{{item.title}}</p>
												</div>
											</span>
											<span slot="typeName" slot-scope="text, record,index">
												<div v-if="record.file_type == 1">图片</div>
												<div v-if="record.file_type == 2">音频</div>
												<div v-if="record.file_type == 3">视频</div>
												<div v-if="record.file_type == 4">图文</div>
												<div v-if="record.file_type == 5">文件</div>
												<div v-if="record.file_type == 6">文本</div>
												<div v-if="record.file_type == 7">小程序</div>
											</span>
											<span slot="action" slot-scope="text, record,index">
												<a-tooltip placement="top" v-if="record.file_type == 6"
												           v-has="'material-edit'">
													<template slot="title">
														编辑
													</template>
													<a-button type="link" @click="editText(index, 1)"
													          v-has="'material-edit'">
														<a-icon type="edit"/>
													</a-button>
												</a-tooltip>
												<a-tooltip v-if="record.is_appli!=1 && record.file_type == 4"
												           placement="top"
												           style="margin-left: 5px;"
												           v-has="'material-edit'">
													<template slot="title">
														编辑
													</template>
													<a-button type="link"
													          @click="editFilingCabinetSketch(index, 1)"
													          v-has="'material-edit'">
														<a-icon type="edit"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" v-if="record.file_type == 7"
												           v-has="'material-edit'">
													<template slot="title">
														编辑
													</template>
													<a-button type="link" @click="editApplet(index, 1)"
													          v-has="'material-edit'">
														<a-icon type="edit"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top"
												           v-if="record.is_editor==1 && record.file_type == 4"
												           style="margin-left: 5px;"
												           v-has="'material-preview'">
													<template slot="title">
														预览
													</template>
													<a-button type="link"
													          @click="previewSketch(index, 1)"
													          v-has="'material-preview'">
														<a-icon type="eye"/>
													</a-button>
												</a-tooltip>
												<!-- 图片预览 -->
												<a-modal :visible="previewAllVisible" :footer="null"
												         @cancel="handleCancel3"
												         class="preview-modal" width="100%"
												         centered>
														<div
																style="width: 840px!important;height: 600px;position: relative;">
															<img
																	alt=""
																	:src="commonUrl + material.local_path"
																	style="max-width:100%;max-height:100%;transform: translate(-50%, -50%);position:absolute;top: 50%;left: 50%;"
															/>
														</div>
												</a-modal>
												<a-tooltip placement="top" v-if="record.file_type== 1"
												           style="margin-left: 5px;"
												           v-has="'material-preview'">
													<template slot="title">
														预览
													</template>
													<a-button type="link" @click="previewPic1(index)"
													          v-has="'material-preview'">
														<a-icon type="eye"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" style="margin-left: 5px;"
												           v-has="'material-remove'">
													<template slot="title">
														移动
													</template>
													<a-button type="link" @click="changeMaterial(record.id, record.group_id)"
													          v-has="'material-remove'">
														<a-icon type="retweet"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top"
												           style="margin-left: 5px;">
													<template slot="title">
														统计
													</template>
													<a-button type="link"
													          @click="statistic(record.id, record.file_type)" v-has="'content-statistic'">
														<a-icon type="rise"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" v-if="record.file_type == 6"
												           v-has="'material-delete'">
													<template slot="title">
														删除
													</template>
													<a-button type="link" @click="delText(record.id)">
														<a-icon type="delete"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" v-if="record.file_type == 2"
												           v-has="'material-delete'">
													<template slot="title">
														删除
													</template>
													<a-button type="link" @click="delAudio(record.id)"
													          v-has="'material-delete'">
														<a-icon type="delete"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" v-if="record.file_type == 3"
												           v-has="'material-delete'">
													<template slot="title">
														删除
													</template>
													<a-button type="link" @click="delVideo(record.id)"
													          v-has="'material-delete'">
														<a-icon type="delete"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" v-if="record.file_type == 5"
												           v-has="'material-delete'">
													<template slot="title">
														删除
													</template>
													<a-button type="link" @click="delFile(record.id)"
													          v-has="'material-delete'">
														<a-icon type="delete"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" v-if="record.file_type == 7"
												           v-has="'material-delete'">
													<template slot="title">
														删除
													</template>
													<a-button type="link" @click="delMiniprogram(record.id)"
													          v-has="'material-delete'">
														<a-icon type="delete"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" v-if="record.file_type == 1"
												           v-has="'material-delete'">
													<template slot="title">
														删除
													</template>
													<a-button type="link" @click="delPic(record.id)"
													          v-has="'material-delete'">
														<a-icon type="delete"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" v-if="record.file_type == 1">
													<template slot="title">
														下载
													</template>
													<a-button type="link"
													          @click="downLoadWay(record.file_name, record.local_path)">
														<a-icon type="download"/>
													</a-button>
												</a-tooltip>
											</span>
										</a-table>
									</div>
									<div style="width: 100%;padding: 0 20px 20px;" v-show="allTotal>0"
									     v-has="'material-list'">
										<div v-hasMore2one="'material-remove,material-delete'"
										     style="height: 32px;display: inline-block;line-height: 32px;margin-bottom: 10px;">
											<a-checkbox v-model="batchTypeValue"
											            @click="batchTypeChange"></a-checkbox>
											<a-select optionFilterProp="children"
											          v-model="batchType"
											          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
												<a-select-option value="0">选择当前页</a-select-option>
												<a-select-option value="1">选择所有</a-select-option>
											</a-select>
											<a-button @click="batchMove" style="margin-right: 5px"
											          :disabled="selectedRowKeys.length == 0" v-has="'material-remove'">
												<a-icon type="retweet"/>
												批量移动
											</a-button>
										</div>
										<div class="pagination" style="height: 32px;float: right;">
											<a-pagination
													:total="allTotal"
													showSizeChanger
													:showQuickJumper="quickJumper"
													:current="allPage"
													:pageSize="allPageSize"
													:pageSizeOptions="['15','30','50','100']"
													@change="changeAllPage"
													@showSizeChange="showAllSizeChange"
											/>
										</div>
									</div>
								</div>
								<!--图片-->
								<div style="height: auto;" v-show="material_type == 1">
									<div class="content-hd">
										<div style="overflow: hidden;margin-bottom: 35px;">
											<div style="height: 32px;margin-bottom:10px;display: inline-block;line-height: 32px;">
												<a-tooltip placement="top">
													<template slot="title">
														<span>卡片展示</span>
													</template>
													<a-icon @click="changeShowType(0)" style="font-size: 20px;"
													        :class="showType == 0 ? 'sketch-type-activity' : ''"
													        type="appstore"/>
												</a-tooltip>
												<a-tooltip placement="top">
													<template slot="title">
														<span>列表展示</span>
													</template>
													<a-icon @click="changeShowType(1)"
													        style="font-size: 20px;margin: 0 10px;"
													        :class="showType == 1 ? 'sketch-type-activity' : ''"
													        type="unordered-list"/>
												</a-tooltip>
												共有
												<span style="color: blue">{{total}}</span>个素材
											</div>
											<div>
												<a-input-search
														placeholder="输入要搜索的内容"
														@search="onSearch"
														v-model="name"
														:allowClear=true
														enterButton="搜索"
														style="width: 275px;"
												/>
												<a-button @click="clearInput" style="margin-left: 10px;">
													清空
												</a-button>
												<a-button v-show="!isMoveType" style="float: right;margin-right: 10px;"
												          icon="reload"
												          @click="showPop"
												          :loading="picWxLoading" v-has="'material-sync'">
													同步公众号
												</a-button>
												<a-button type="primary" @click="showModal"
												          style="float: right;margin-right: 10px;"
												          v-has="'material-add'">
													<a-icon type="upload"/>
													上传图片
												</a-button>
											</div>
										</div>

										<div
												style="margin: 100px;height: 400px;text-align: center;"
												v-show="materialList2.length == 0?true:false"
										>
											<img
													src="../../../assets/null.png"
													style="width: 150px;display: block;margin: auto;-o-object-fit: cover;"
											/>
											<p style="text-align: center;">暂无数据</p>
										</div>
										<!--										:id="item2.id" draggable="true" @dragstart="drag"-->
										<div v-show="showType == 0" class="oddCard"
										     v-for="(item2,index) in materialList2"
										     :key="item2.id" v-has="'material-list'">
											<a-card
													hoverable
													style="width: 90%;margin:auto;"

											>
												<div slot="title">
													<span style="font-size: 14px;width: calc(100% - 50px); display: inline-block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item2.create_time}}</span>
													<a-checkbox style="float: right" v-model="checkBoxValue[index]"
													            v-hasMore2one="'material-remove,material-delete'"
													            @click="changeSelectKey(item2.key)"></a-checkbox>
												</div>
												<img
														:id="item2.id"
														alt="example"
														:src="commonUrl+(item2.s_local_path || item2.local_path)"
														slot="cover"
														style="object-fit: contain;"
														@click="previewPic(index)"
												/>
												<template class="ant-card-actions" slot="actions">
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-preview'">
														<template slot="title">
															预览
														</template>
														<a-button type="link" @click="previewPic(index)"
														          v-has="'material-preview'">
															<a-icon type="eye"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-remove'">
														<template slot="title">
															移动
														</template>
														<a-button type="link" @click="changeMaterial(item2.id, item2.group_id)"
														          v-has="'material-remove'">
															<a-icon type="retweet"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top"
													           style="margin-left: 5px;">
														<template slot="title">
															统计
														</template>
														<a-button type="link"
														          @click="statistic(item2.id, material_type)" v-has="'content-statistic'">
															<a-icon type="rise"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-delete'">
														<template slot="title">
															删除
														</template>
														<a-button type="link" @click="delPic(item2.id)"
														          v-has="'material-delete'">
															<a-icon type="delete"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;">
														<template slot="title">
															下载
														</template>
														<a-button type="link"
														          @click="downLoadWay(item2.file_name, item2.local_path)">
															<a-icon type="download"/>
														</a-button>
													</a-tooltip>
												</template>
												<div
														style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px;margin-top: -47px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
												>{{item2.file_name}}
												</div>
												<div style="margin: 5px 0px 2px;width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
													上传者：{{item2.username}}
												</div>
												<a-tooltip placement="top">
													<template slot="title">
														<span>{{item2.group_name}}</span>
													</template>
													<div style="width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
														来源：{{item2.group_name}}
													</div>
												</a-tooltip>
											</a-card>
										</div>

										<!-- 图片预览 -->
										<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel2"
										         class="preview-modal" width="100%"
										         centered>
											<a-carousel
													ref="previewCarousel"
													arrows
													:dots="false"
													effect="fade"
													:adaptiveHeight="true">
												<div
														slot="prevArrow"
														slot-scope="props"
														class="custom-slick-arrow"
														style="left: 10px;zIndex: 1">
													<a-icon type="left-circle"/>
												</div>

												<div
														slot="nextArrow"
														slot-scope="props"
														class="custom-slick-arrow"
														style="right: 10px">
													<a-icon type="right-circle"/>
												</div>

												<div v-for="(preview, key) in materialList2"
												     style="width: 840px!important;height: 600px;position: relative;">
													<img
															alt=""
															:src="commonUrl + preview.local_path"
															style="max-width:100%;max-height:100%;transform: translate(-50%, -50%);position:absolute;top: 50%;left: 50%;"
													/>
												</div>
											</a-carousel>
										</a-modal>

									</div>
									<div v-show="showType == 1">
										<a-table v-show="total > 0" :columns="imageColomns"
										         :dataSource="materialList2"
										         :pagination="false"
										         style="margin:0 0 30px 0px;" rowKey="id"
										         :rowClassName="rowClassName"
										         v-has="'material-list'">
											<span slot="checkedBox" slot-scope="text, record,index">
												<a-checkbox style="float: right"
												            v-hasMore2one="'material-remove,material-delete'"
												            v-model="checkBoxValue[index]"
												            @click="changeSelectKey(record.key)"></a-checkbox>
											</span>
											<span slot="content" slot-scope="text, record,index">
												<div style="display: inline-block; width: 100px;height: 100px;line-height: 100px;">
													<img
															:id="record.id"
															alt="example"
															:src="commonUrl+(record.s_local_path || record.local_path)"
															slot="cover"
															style="max-width: 100px; max-height: 100px;"
															@click="previewPic(index)"
													/>
												</div>
											</span>
											<span slot="action" slot-scope="text, record,index">
												<a-tooltip placement="top" style="margin-left: 5px;"
												           v-has="'material-preview'">
														<template slot="title">
															预览
														</template>
														<a-button type="link" @click="previewPic(index)"
														          v-has="'material-preview'">
															<a-icon type="eye"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-remove'">
														<template slot="title">
															移动
														</template>
														<a-button type="link" @click="changeMaterial(record.id, record.group_id)"
														          v-has="'material-remove'">
															<a-icon type="retweet"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top"
													           style="margin-left: 5px;">
														<template slot="title">
															统计
														</template>
														<a-button type="link"
														          @click="statistic(record.id, material_type)" v-has="'content-statistic'">
															<a-icon type="rise"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-delete'">
														<template slot="title">
															删除
														</template>
														<a-button type="link" @click="delPic(record.id)"
														          v-has="'material-delete'">
															<a-icon type="delete"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;">
														<template slot="title">
															下载
														</template>
														<a-button type="link"
														          @click="downLoadWay(record.file_name, record.local_path)">
															<a-icon type="download"/>
														</a-button>
													</a-tooltip>
											</span>
										</a-table>
									</div>
									<!-- 图片分页 -->
									<div style="width: 100%;padding: 0 20px 20px;" v-show="total>0"
									     v-has="'material-list'">
										<div v-hasMore2one="'material-remove,material-delete'"
										     style="height: 32px;display: inline-block;line-height: 32px;margin-bottom: 10px;">
											<a-checkbox v-model="batchTypeValue" @click="batchTypeChange"></a-checkbox>
											<a-select optionFilterProp="children" v-model="batchType"
											          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
												<a-select-option value="0">选择当前页</a-select-option>
												<a-select-option value="1">选择所有</a-select-option>
											</a-select>
											<a-button @click="batchMove" style="margin-right: 5px"
											          :disabled="selectedRowKeys.length == 0" v-has="'material-remove'">
												<a-icon type="retweet"/>
												批量移动
											</a-button>
											<a-button @click="batchDelete" :disabled="selectedRowKeys.length == 0"
											          v-has="'material-delete'">
												<a-icon type="delete"/>
												批量删除
											</a-button>
											<a-button style="margin-left: 5px;" @click="batchUpload"
											          :disabled="selectedRowKeys.length == 0">
												<a-icon type="delete"/>
												批量下载
											</a-button>
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
								</div>
								<!--音频-->
								<div v-if="material_type == 2">
									<div class="content-hd">
										<div style="height: 32px;margin-bottom: 10px;line-height: 32px;">
											<a-tooltip placement="top">
												<template slot="title">
													<span>卡片展示</span>
												</template>
												<a-icon @click="changeShowType(0)" style="font-size: 20px;"
												        :class="showType == 0 ? 'sketch-type-activity' : ''"
												        type="appstore"/>
											</a-tooltip>
											<a-tooltip placement="top">
												<template slot="title">
													<span>列表展示</span>
												</template>
												<a-icon @click="changeShowType(1)"
												        style="font-size: 20px;margin: 0 10px;"
												        :class="showType == 1 ? 'sketch-type-activity' : ''"
												        type="unordered-list"/>
											</a-tooltip>
											共有
											<span style="color: blue">{{total3}}</span>个素材
										</div>
										<div>
											<a-input-search
													placeholder="输入要搜索的内容"
													@search="onSearch"
													v-model="name"
													:allowClear=true
													enterButton="搜索"
													style="width: 275px;"
											/>
											<a-button @click="clearInput" style="margin-left: 10px;">
												清空
											</a-button>
											<a-button style="float: right;margin-right: 10px;" icon="reload"
											          @click="showPop"
											          :loading="voiceWxLoading" v-has="'material-sync'">
												同步公众号
											</a-button>
											<a-button type="primary" @click="showModalVoice"
											          style="float: right;margin-right: 10px;" v-has="'material-add'">
												<a-icon type="upload"/>
												上传音频
											</a-button>
										</div>
									</div>
									<div style="height: 400px; text-align: center;margin: 100px;"
									     v-show="materialList3.length == 0?true:false">
										<img
												src="../../../assets/null.png"
												style="width: 150px;display: block;margin: auto;"
										/>
										<p style="text-align: center;">暂无数据</p>
									</div>
									<!--									:id="item3.id" draggable="true" @dragstart="drag"-->
									<div v-show="showType == 0" class="oddCard" v-for="(item3,index3) in materialList3"
									     :key="item3.id"
									     v-has="'material-list'">
										<a-card hoverable style="width: 90%;margin:auto;">
											<div style="font-size: 14px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
												<span style="color: #999; font-weight: 500; font-size: 14px;width: calc(100% - 50px); display: inline-block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item3.create_time}}</span>
												<a-checkbox v-hasMore2one="'material-remove,material-delete'"
												            style="float: right" v-model="checkBoxValue[index3]"
												            @click="changeSelectKey(item3.key)"></a-checkbox>
											</div>
											<div class="audio">
												<div class="box" style="float: left;" @click="playMusic(index3, true)"
												     v-show="clickIndex != index3">
													<div class="wifi-symbol">
														<div class="wifi-circle first"></div>
														<div class="wifi-circle second"></div>
														<div class="wifi-circle third"></div>
													</div>
													<audio ref="audio" :data-index="index3" @canplay="oncanplay">
														<source
																:src="commonUrl+item3.local_path"
																type="audio/mpeg"
														/>
													</audio>
												</div>
												<div class="box" style="float: left;" v-show="clickIndex == index3"
												     @click="playMusic(index3, false)">
													<div class="wifi-symbol">
														<div class="wifi-circle first"></div>
														<div class="wifi-circle second1"></div>
														<div class="wifi-circle third1"></div>
													</div>
												</div>
												<div
														style="text-align: right;padding: 0px 5px;float: right;margin-top: 10px;"
												>{{playTime[index3] | dateFormat}}
												</div>
											</div>

											<template class="ant-card-actions" slot="actions">

												<a-tooltip placement="top" style="margin-left: 5px;"
												           v-has="'material-remove'">
													<template slot="title">
														移动
													</template>
													<a-button type="link" @click="changeMaterial(item3.id, item3.group_id)"
													          v-has="'material-remove'">
														<a-icon type="retweet"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top"
												           style="margin-left: 5px;">
													<template slot="title">
														统计
													</template>
													<a-button type="link" @click="statistic(item3.id, material_type)" v-has="'content-statistic'">
														<a-icon type="rise"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" style="margin-left: 5px;"
												           v-has="'material-delete'">
													<template slot="title">
														删除
													</template>
													<a-button type="link" @click="delAudio(item3.id)"
													          v-has="'material-delete'">
														<a-icon type="delete"/>
													</a-button>
												</a-tooltip>
											</template>
											<div style="height: 30px; line-height: 30px; font-size: 14px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px;">
												{{item3.file_name}}
											</div>
											<div style="margin: 5px 0px 2px;width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
												上传者：{{item3.username}}
											</div>
											<a-tooltip placement="top">
												<template slot="title">
													<span>{{item3.group_name}}</span>
												</template>
												<div style="width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
													来源：{{item3.group_name}}
												</div>
											</a-tooltip>

										</a-card>
									</div>
									<div v-show="showType == 1">
										<a-table v-show="total3 > 0" :columns="voiceColomns"
										         :dataSource="materialList3"
										         :pagination="false"
										         style="margin:0 0 30px 0px;" rowKey="id"
										         :rowClassName="rowClassName"
										         v-has="'material-list'">
											<span slot="checkedBox" slot-scope="text, record,index">
												<a-checkbox style="float: right"
												            v-hasMore2one="'material-remove,material-delete'"
												            v-model="checkBoxValue[index]"
												            @click="changeSelectKey(record.key)"></a-checkbox>
											</span>
											<span slot="content" slot-scope="text, record,index">
												<div class="audio">
													<div class="box" style="float: left" @click="playMusic(index, true)"
													     v-show="clickIndex != index">
														<div class="wifi-symbol">
															<div class="wifi-circle first"></div>
															<div class="wifi-circle second"></div>
															<div class="wifi-circle third"></div>
														</div>
														<audio :data-index="index" @canplay="oncanplay">
															<source
																	:src="commonUrl+record.local_path"
																	type="audio/mpeg"
															/>
														</audio>
													</div>
													<div class="box" style="float: left" v-show="clickIndex == index"
													     @click="playMusic(index, false)">
														<div class="wifi-symbol">
															<div class="wifi-circle first"></div>
															<div class="wifi-circle second1"></div>
															<div class="wifi-circle third1"></div>
														</div>
													</div>

												</div>
												<div
														style="text-align: left;padding: 0 5px;"
												>{{playTime[index] | dateFormat}}
												</div>
											</span>
											<span slot="action" slot-scope="text, record,index">
												<a-tooltip placement="top" style="margin-left: 5px;"
												           v-has="'material-remove'">
													<template slot="title">
														移动
													</template>
													<a-button type="link" @click="changeMaterial(record.id, record.group_id)"
													          v-has="'material-remove'">
														<a-icon type="retweet"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top"
												           style="margin-left: 5px;">
													<template slot="title">
														统计
													</template>
													<a-button type="link" @click="statistic(record.id, material_type)" v-has="'content-statistic'">
														<a-icon type="rise"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" style="margin-left: 5px;"
												           v-has="'material-delete'">
													<template slot="title">
														删除
													</template>
													<a-button type="link" @click="delAudio(record.id)"
													          v-has="'material-delete'">
														<a-icon type="delete"/>
													</a-button>
												</a-tooltip>
											</span>
										</a-table>
									</div>
									<!-- 音频分页 -->
									<div style="width: 100%;padding: 0 20px 20px;" v-if="total3>0"
									     v-has="'material-list'">
										<div v-hasMore2one="'material-remove,material-delete'"
										     style="height: 32px;display: inline-block;line-height: 32px;margin-bottom: 10px;">
											<a-checkbox v-model="batchTypeValue"
											            @click="batchTypeChange"></a-checkbox>
											<a-select optionFilterProp="children"
											          v-model="batchType"
											          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
												<a-select-option value="0">选择当前页</a-select-option>
												<a-select-option value="1">选择所有</a-select-option>
											</a-select>
											<a-button @click="batchMove" style="margin-right: 5px"
											          :disabled="selectedRowKeys.length == 0" v-has="'material-remove'">
												<a-icon type="retweet"/>
												批量移动
											</a-button>
											<a-button @click="batchDelete" :disabled="selectedRowKeys.length == 0"
											          v-has="'material-delete'">
												<a-icon type="delete"/>
												批量删除
											</a-button>
										</div>
										<div class="pagination" style="height: 32px;float: right;">
											<a-pagination
													:total="total3"
													showSizeChanger
													:showQuickJumper="quickJumper3"
													:current="page3"
													:pageSize="pageSize3"
													:pageSizeOptions="['15','30','50','100']"
													@change="changePage3"
													@showSizeChange="showSizeChange3"
											/>
										</div>
									</div>
								</div>
								<!--视频-->
								<div v-if="material_type == 3">
									<div class="content-hd">
										<div style="height: 32px;line-height: 32px;margin-bottom: 10px;">
											<a-tooltip placement="top">
												<template slot="title">
													<span>卡片展示</span>
												</template>
												<a-icon @click="changeShowType(0)" style="font-size: 20px;"
												        :class="showType == 0 ? 'sketch-type-activity' : ''"
												        type="appstore"/>
											</a-tooltip>
											<a-tooltip placement="top">
												<template slot="title">
													<span>列表展示</span>
												</template>
												<a-icon @click="changeShowType(1)"
												        style="font-size: 20px;margin: 0 10px;"
												        :class="showType == 1 ? 'sketch-type-activity' : ''"
												        type="unordered-list"/>
											</a-tooltip>
											共有
											<span style="color: blue">{{total4}}</span>个素材
										</div>
										<div>
											<a-input-search
													placeholder="输入要搜索的内容"
													@search="onSearch"
													v-model="name"
													:allowClear=true
													enterButton="搜索"
													style="width: 275px;"
											/>
											<a-button @click="clearInput" style="margin-left: 10px;">
												清空
											</a-button>
											<a-button style="float: right;margin-right: 10px;" icon="reload"
											          @click="showPop"
											          :loading="videoWxLoading" v-has="'material-sync'">
												同步公众号
											</a-button>
											<a-button type="primary" @click="showModalVideo"
											          style="float: right;margin-right: 10px;" v-has="'material-add'">
												<a-icon type="upload"/>
												上传视频
											</a-button>
										</div>
									</div>
									<div style="height: 400px;text-align: center;margin: 100px;"
									     v-show="materialList4.length == 0?true:false">
										<img
												src="../../../assets/null.png"
												style="width: 150px;display: block;margin: auto;"
										/>
										<p style="text-align: center;">暂无数据</p>
									</div>
									<div v-show="showType == 0" class="oddCard" v-for="(item4,index4) in materialList4"
									     :key="item4.id"
									     v-has="'material-list'">
										<!--										:id="item4.id" draggable="true" @dragstart="drag"-->
										<a-card hoverable style="width: 90%;margin:auto;">
											<div slot="title">
												<span style="font-size: 14px;width: calc(100% - 50px); display: inline-block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item4.create_time}}</span>
												<a-checkbox v-hasMore2one="'material-remove,material-delete'"
												            style="float: right" v-model="checkBoxValue[index4]"
												            @click="changeSelectKey(item4.key)"></a-checkbox>
											</div>
											<video-player
													class="video-player vjs-custom-skin"
													ref="videoPlayer"
													:playsinline="true"
													:options="playerOptions[index4]"
											></video-player>
											<template class="ant-card-actions" slot="actions">
												<a-tooltip placement="top" style="margin-left: 5px;"
												           v-has="'material-remove'">
													<template slot="title">
														移动
													</template>
													<a-button type="link" @click="changeMaterial(item4.id, item4.group_id)"
													          v-has="'material-remove'">
														<a-icon type="retweet"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top"
												           style="margin-left: 5px;">
													<template slot="title">
														统计
													</template>
													<a-button type="link" @click="statistic(item4.id, material_type)" v-has="'content-statistic'">
														<a-icon type="rise"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" style="margin-left: 5px;"
												           v-has="'material-delete'">
													<template slot="title">
														删除
													</template>
													<a-button type="link" @click="delVideo(item4.id)"
													          v-has="'material-delete'">
														<a-icon type="delete"/>
													</a-button>
												</a-tooltip>
											</template>
											<div
													style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
											>{{item4.file_name}}
											</div>
											<div style="margin: 5px 0px 2px;width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
												上传者：{{item4.username}}
											</div>
											<a-tooltip placement="top">
												<template slot="title">
													<span>{{item4.group_name}}</span>
												</template>
												<div style="width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
													来源：{{item4.group_name}}
												</div>
											</a-tooltip>

										</a-card>
									</div>
									<div v-if="showType == 1">
										<a-table v-show="total4 > 0" :columns="voiceColomns"
										         :dataSource="materialList4"
										         :pagination="false"
										         style="margin:0 0 30px 0px;" rowKey="id"
										         :rowClassName="rowClassName"
										         v-has="'material-list'">
											<span slot="checkedBox" slot-scope="text, record,index">
												<a-checkbox style="float: right"
												            v-hasMore2one="'material-remove,material-delete'"
												            v-model="checkBoxValue[index]"
												            @click="changeSelectKey(record.key)"></a-checkbox>
											</span>
											<span slot="content" slot-scope="text, record,index">
												<video-player
														class="video-player vjs-custom-skin"
														ref="videoPlayer"
														style="width: 200px;"
														:playsinline="true"
														:options="playerOptions[index]"
												></video-player>
											</span>
											<span slot="action" slot-scope="text, record,index">
												<a-tooltip placement="top" style="margin-left: 5px;"
												           v-has="'material-remove'">
													<template slot="title">
														移动
													</template>
													<a-button type="link" @click="changeMaterial(record.id, record.group_id)"
													          v-has="'material-remove'">
														<a-icon type="retweet"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top"
												           style="margin-left: 5px;">
													<template slot="title">
														统计
													</template>
													<a-button type="link" @click="statistic(record.id, material_type)" v-has="'content-statistic'">
														<a-icon type="rise"/>
													</a-button>
												</a-tooltip>
												<a-tooltip placement="top" style="margin-left: 5px;"
												           v-has="'material-delete'">
													<template slot="title">
														删除
													</template>
													<a-button type="link" @click="delVideo(record.id)"
													          v-has="'material-delete'">
														<a-icon type="delete"/>
													</a-button>
												</a-tooltip>
											</span>
										</a-table>
									</div>
									<!-- 视频分页 -->
									<div style="width: 100%;padding: 0 20px 20px;" v-if="total4>0"
									     v-has="'material-list'">
										<div v-hasMore2one="'material-remove,material-delete'"
										     style="height: 32px;display: inline-block;line-height: 32px;margin-bottom: 10px;">
											<a-checkbox v-model="batchTypeValue"
											            @click="batchTypeChange"></a-checkbox>
											<a-select optionFilterProp="children"
											          v-model="batchType"
											          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
												<a-select-option value="0">选择当前页</a-select-option>
												<a-select-option value="1">选择所有</a-select-option>
											</a-select>
											<a-button @click="batchMove" style="margin-right: 5px"
											          :disabled="selectedRowKeys.length == 0" v-has="'material-remove'">
												<a-icon type="retweet"/>
												批量移动
											</a-button>
											<a-button @click="batchDelete" :disabled="selectedRowKeys.length == 0"
											          v-has="'material-delete'">
												<a-icon type="delete"/>
												批量删除
											</a-button>
										</div>

										<div class="pagination" style="height: 32px;display: inline-block;float: right">
											<a-pagination
													:total="total4"
													showSizeChanger
													:showQuickJumper="quickJumper4"
													:current="page4"
													:pageSize="pageSize4"
													:pageSizeOptions="['15','30','50','100']"
													@change="changePage4"
													@showSizeChange="showSizeChange4"
											/>
										</div>
									</div>
								</div>
								<!--小程序-->
								<div class="applet" style="height: auto;" v-show="material_type == 7">
									<div class="content-hd">
										<div style="overflow: hidden;margin-bottom: 35px;">
											<div style="height: 32px;margin-bottom: 10px;line-height: 32px;">
												<a-tooltip placement="top">
													<template slot="title">
														<span>卡片展示</span>
													</template>
													<a-icon @click="changeShowType(0)" style="font-size: 20px;"
													        :class="showType == 0 ? 'sketch-type-activity' : ''"
													        type="appstore"/>
												</a-tooltip>
												<a-tooltip placement="top">
													<template slot="title">
														<span>列表展示</span>
													</template>
													<a-icon @click="changeShowType(1)"
													        style="font-size: 20px;margin: 0 10px;"
													        :class="showType == 1 ? 'sketch-type-activity' : ''"
													        type="unordered-list"/>
												</a-tooltip>
												共有
												<span style="color: blue">{{total5}}</span>个素材
											</div>
											<div style="float: left;">
												<a-input-search
														placeholder="输入要搜索的内容"
														@search="onSearch"
														v-model="name"
														:allowClear=true
														enterButton="搜索"
														style="width: 275px;"
												/>
												<a-button @click="clearInput" style="margin-left: 10px;">
													清空
												</a-button>
											</div>
											<a-button type="primary" @click="showModalMiniprogram"
											          style="float: right;margin-right: 10px;" v-has="'material-add'">
												<a-icon type="plus"/>
												添加小程序
											</a-button>
										</div>

										<div
												style="margin: 100px;height: 400px;text-align: center;"
												v-show="materialList5.length == 0?true:false"
										>
											<img
													src="../../../assets/null.png"
													style="width: 150px;display: block;margin: auto;"
											/>
											<p style="text-align: center;">暂无数据</p>
										</div>
										<!--										:id="item5.id" draggable="true" @dragstart="drag"-->
										<div v-show="showType == 0" class="oddCard"
										     v-for="(item5,index) in materialList5"
										     :key="item5.id" v-has="'material-list'">
											<!--											<div style="width: 90%;margin: auto; color: rgba(0,0,0, 0.2)">-->
											<!--												新增于{{item5.file_name}}-->
											<!--											</div>-->
											<a-card
													hoverable
													style="width: 90%;margin:auto;"
											>
												<div slot="title">
													<span style="font-size: 14px;width: calc(100% - 50px); display: inline-block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item5.create_time}}</span>
													<a-checkbox v-hasMore2one="'material-remove,material-delete'"
													            style="float: right" v-model="checkBoxValue[index]"
													            @click="changeSelectKey(item5.key)"></a-checkbox>
												</div>
												<img :id="item5.id"
												     alt="example"
												     :style="itemAppletHeight"
												     :src="commonUrl+item5.local_path"
												     slot="cover"
												/>
												<template class="ant-card-actions" slot="actions">
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-remove'">
														<template slot="title">
															移动
														</template>
														<a-button type="link" @click="changeMaterial(item5.id, record.group_id)"
														          v-has="'material-remove'">
															<a-icon type="retweet"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-edit'">
														<template slot="title">
															编辑
														</template>
														<a-button type="link" @click="editApplet(index)"
														          v-has="'material-edit'">
															<a-icon type="edit"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top"
													           style="margin-left: 5px;">
														<template slot="title">
															统计
														</template>
														<a-button type="link"
														          @click="statistic(item5.id, material_type)" v-has="'content-statistic'">
															<a-icon type="rise"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-delete'">
														<template slot="title">
															删除
														</template>
														<a-button type="link" @click="delMiniprogram(item5.id)"
														          v-has="'material-delete'">
															<a-icon type="delete"/>
														</a-button>
													</a-tooltip>
												</template>
												<div style="height: 30px; line-height: 30px; font-size: 14px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px;margin-top: -46px;">
													{{item5.file_name}}
												</div>
												<div style="margin-top: 5px;color: rgba(0,0,0,0.5)">
													<MyIcon type="icon-miniapp"></MyIcon>
													小程序
												</div>
												<div style="margin: 2px 0px; width: 90%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
													上传者：{{item5.username}}
												</div>
												<a-tooltip placement="top">
													<template slot="title">
														<span>{{item5.group_name}}</span>
													</template>
													<div style="width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
														来源：{{item5.group_name}}
													</div>
												</a-tooltip>

											</a-card>
										</div>
										<div v-show="showType == 1">
											<a-table v-show="total5 > 0" :columns="appletColomns"
											         :dataSource="materialList5"
											         :pagination="false"
											         style="margin:0 0 30px 0px;" rowKey="id"
											         :rowClassName="rowClassName"
											         v-has="'material-list'">
												<span slot="checkedBox" slot-scope="text, record,index">
												<a-checkbox style="float: right"
												            v-hasMore2one="'material-remove,material-delete'"
												            v-model="checkBoxValue[index]"
												            @click="changeSelectKey(record.key)"></a-checkbox>
											</span>
												<span slot="content" slot-scope="text, record,index">
													<div style="display: inline-block; width: 100px;height: 100px;line-height: 100px;">
														<img
																:id="record.id"
																alt="example"
																:src="commonUrl+(record.s_local_path || record.local_path)"
																slot="cover"
																style="max-width: 100px; max-height: 100px;"
																@click="previewPic(index)"
														/>
													</div>
												</span>
												<span slot="action" slot-scope="text, record,index">
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-remove'">
														<template slot="title">
															移动
														</template>
														<a-button type="link" @click="changeMaterial(record.id, record.group_id)"
														          v-has="'material-remove'">
															<a-icon type="retweet"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-edit'">
														<template slot="title">
															编辑
														</template>
														<a-button type="link" @click="editApplet(index)"
														          v-has="'material-edit'">
															<a-icon type="edit"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top"
													           style="margin-left: 5px;">
														<template slot="title">
															统计
														</template>
														<a-button type="link"
														          @click="statistic(record.id, material_type)" v-has="'content-statistic'">
															<a-icon type="rise"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-delete'">
														<template slot="title">
															删除
														</template>
														<a-button type="link" @click="delMiniprogram(record.id)"
														          v-has="'material-delete'">
															<a-icon type="delete"/>
														</a-button>
													</a-tooltip>
												</span>
											</a-table>
										</div>
									</div>

									<!-- 小程序分页 -->
									<div style="width: 100%;padding: 0 20px 20px;" v-show="total5>0"
									     v-has="'material-list'">
										<div v-hasMore2one="'material-remove,material-delete'"
										     style="height: 32px;display: inline-block;line-height: 32px;margin-bottom: 10px;">
											<a-checkbox v-model="batchTypeValue"
											            @click="batchTypeChange"></a-checkbox>
											<a-select optionFilterProp="children"
											          v-model="batchType"
											          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
												<a-select-option value="0">选择当前页</a-select-option>
												<a-select-option value="1">选择所有</a-select-option>
											</a-select>
											<a-button @click="batchMove" style="margin-right: 5px"
											          :disabled="selectedRowKeys.length == 0" v-has="'material-remove'">
												<a-icon type="retweet"/>
												批量移动
											</a-button>
											<a-button @click="batchDelete" :disabled="selectedRowKeys.length == 0"
											          v-has="'material-delete'">
												<a-icon type="delete"/>
												批量删除
											</a-button>
										</div>
										<div class="pagination" style="height: 32px;float: right;">
											<a-pagination
													:total="total5"
													showSizeChanger
													:showQuickJumper="quickJumper"
													:current="page5"
													:pageSize="pageSize5"
													:pageSizeOptions="['15','30','50','100']"
													@change="changePage5"
													@showSizeChange="showSizeChange5"
											/>
										</div>
									</div>
								</div>
								<!--文件-->
								<div style="height: auto;" v-show="material_type == 5">
									<div class="content-hd">
										<div style="overflow: hidden;margin-bottom: 35px;">
											<div style="height: 32px;margin-bottom: 10px;line-height: 32px;">
												<a-tooltip placement="top">
													<template slot="title">
														<span>卡片展示</span>
													</template>
													<a-icon @click="changeShowType(0)" style="font-size: 20px;"
													        :class="showType == 0 ? 'sketch-type-activity' : ''"
													        type="appstore"/>
												</a-tooltip>
												<a-tooltip placement="top">
													<template slot="title">
														<span>列表展示</span>
													</template>
													<a-icon @click="changeShowType(1)"
													        style="font-size: 20px;margin: 0 10px;"
													        :class="showType == 1 ? 'sketch-type-activity' : ''"
													        type="unordered-list"/>
												</a-tooltip>
												共有
												<span style="color: blue">{{total6}}</span>个素材
											</div>
											<div style="float: left;">
												<a-input-search
														placeholder="输入要搜索的内容"
														@search="onSearch"
														v-model="name"
														:allowClear=true
														enterButton="搜索"
														style="width: 275px;"
												/>
												<a-button @click="clearInput" style="margin-left: 10px;">
													清空
												</a-button>
											</div>
											<a-button type="primary" @click="showModalFile"
											          style="float: right; margin-right: 10px;" v-has="'material-add'">
												<a-icon type="upload"/>
												上传文件
											</a-button>
										</div>

										<div
												style="margin: 100px;height: 400px;text-align: center;"
												v-show="materialList6.length == 0?true:false"
										>
											<img
													src="../../../assets/null.png"
													style="width: 150px;display: block;margin: auto;"
											/>
											<p style="text-align: center;">暂无数据</p>
										</div>

										<!--										:id="item6.id" draggable="true" @dragstart="drag"-->
										<div v-show="showType == 0"
										     class="oddCard"
										     v-for="(item6,index) in materialList6"
										     :key="item6.id" v-has="'material-list'">
											<!--											<div style="width: 90%; margin: auto; color: rgba(0,0,0, 0.2)">-->
											<!--												新增于{{item6.create_time}}-->
											<!--											</div>-->
											<a-card
													hoverable
													style="width: 90%;margin:auto;"
											>
												<div slot="title">
													<span style="font-size: 14px;width: calc(100% - 50px); display: inline-block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item6.create_time}}</span>
													<a-checkbox v-hasMore2one="'material-remove,material-delete'"
													            style="float: right" v-model="checkBoxValue[index]"
													            @click="changeSelectKey(item6.key)"></a-checkbox>
												</div>
												<div>
													<img
															alt="example" v-if="item6.extension == 'doc'"
															style="width: 80px;height: 80px;margin: 0 !important;"
															src="../../../assets/fileIcon/doc.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="item6.extension == 'docx'"
															style="width: 80px;height: 80px;margin: 0 !important;"
															src="../../../assets/fileIcon/docx.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="item6.extension == 'xlsx'"
															style="width: 80px;height: 80px;margin: 0 !important;"
															src="../../../assets/fileIcon/xlsx.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="item6.extension == 'xls'"
															style="width: 80px;height: 80px;margin: 0 !important;"
															src="../../../assets/fileIcon/xls.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="item6.extension == 'csv'"
															style="width: 80px;height: 80px;margin: 0 !important;"
															src="../../../assets/fileIcon/csv.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="item6.extension == 'pptx'"
															style="width: 80px;height: 80px;margin: 0 !important;"
															src="../../../assets/fileIcon/pptx.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="item6.extension == 'ppt'"
															style="width: 80px;height: 80px;margin: 0 !important;"
															src="../../../assets/fileIcon/ppt.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="item6.extension == 'txt'"
															style="width: 80px;height: 80px;margin: 0 !important;"
															src="../../../assets/fileIcon/txt.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="item6.extension == 'pdf'"
															style="width: 80px;height: 80px;margin: 0 !important;"
															src="../../../assets/fileIcon/pdf.png"
															slot="cover"
													/>
													<img
															alt="example" v-if="item6.extension == 'xmind'"
															style="width: 80px;height: 80px;margin: 0 !important;"
															src="../../../assets/fileIcon/xmind.png"
															slot="cover"
													/>

													<div class="file-name">{{item6.file_name}}</div>
												</div>
												<template class="ant-card-actions" slot="actions">
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-remove'">
														<template slot="title">
															移动
														</template>
														<a-button type="link" @click="changeMaterial(item6.id, item6.group_id)"
														          v-has="'material-remove'">
															<a-icon type="retweet"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top"
													           style="margin-left: 5px;">
														<template slot="title">
															统计
														</template>
														<a-button type="link"
														          @click="statistic(item6.id, material_type)" v-has="'content-statistic'">
															<a-icon type="rise"/>
														</a-button>
													</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-delete'">
														<template slot="title">
															删除
														</template>
														<a-button type="link" @click="delFile(item6.id)"
														          v-has="'material-delete'">
															<a-icon type="delete"/>
														</a-button>
													</a-tooltip>
												</template>
												<div style="margin: 5px 0px 2px;width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
													上传者：{{item6.username}}
												</div>
												<a-tooltip placement="top">
													<template slot="title">
														<span>{{item6.group_name}}</span>
													</template>
													<div style="width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
														来源：{{item6.group_name}}
													</div>
												</a-tooltip>

											</a-card>
										</div>
										<div v-if="showType == 1">
											<a-table v-show="total6 > 0" :columns="fileColomns"
											         :dataSource="materialList6"
											         :pagination="false"
											         style="margin:0 0 30px 0px;" rowKey="id"
											         :rowClassName="rowClassName"
											         v-has="'material-list'">
												<span slot="checkedBox" slot-scope="text, record,index">
													<a-checkbox style="float: right"
													            v-hasMore2one="'material-remove,material-delete'"
													            v-model="checkBoxValue[index]"
													            @click="changeSelectKey(record.key)"></a-checkbox>
												</span>
												<span slot="action" slot-scope="text, record,index">
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-remove'">
														<template slot="title">
															移动
														</template>
														<a-button type="link" @click="changeMaterial(record.id, record.group_id)"
														          v-has="'material-remove'">
															<a-icon type="retweet"/>
														</a-button>
													</a-tooltip>
												<a-tooltip placement="top"
												           style="margin-left: 5px;">
													<template slot="title">
														统计
													</template>
													<a-button type="link" @click="statistic(record.id, material_type)" v-has="'content-statistic'">
														<a-icon type="rise"/>
													</a-button>
												</a-tooltip>
													<a-tooltip placement="top" style="margin-left: 5px;"
													           v-has="'material-delete'">
														<template slot="title">
															删除
														</template>
														<a-button type="link" @click="delFile(record.id)"
														          v-has="'material-delete'">
															<a-icon type="delete"/>
														</a-button>
													</a-tooltip>
												</span>
											</a-table>
										</div>
									</div>

									<!-- 文件分页 -->
									<div style="width: 100%;padding: 0 20px 20px;" v-show="total6>0"
									     v-has="'material-list'">
										<div v-hasMore2one="'material-remove,material-delete'"
										     style="height: 32px;display: inline-block;line-height: 32px;margin-bottom: 10px;">
											<a-checkbox v-model="batchTypeValue"
											            @click="batchTypeChange"></a-checkbox>
											<a-select optionFilterProp="children"
											          v-model="batchType"
											          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
												<a-select-option value="0">选择当前页</a-select-option>
												<a-select-option value="1">选择所有</a-select-option>
											</a-select>
											<a-button @click="batchMove" style="margin-right: 5px"
											          :disabled="selectedRowKeys.length == 0" v-has="'material-remove'">
												<a-icon type="retweet"/>
												批量移动
											</a-button>
											<a-button @click="batchDelete" :disabled="selectedRowKeys.length == 0"
											          v-has="'material-delete'">
												<a-icon type="delete"/>
												批量删除
											</a-button>
										</div>
										<div class="pagination" style="height: 32px;float: right;">
											<a-pagination
													:total="total6"
													showSizeChanger
													:showQuickJumper="quickJumper"
													:current="page6"
													:pageSize="pageSize6"
													:pageSizeOptions="['15','30','50','100']"
													@change="changePage6"
													@showSizeChange="showSizeChange6"
											/>
										</div>
									</div>
								</div>
								<!--文本-->
								<div style="height: auto;" v-show="material_type == 6">
									<div class="content-hd">
										<div style="overflow: hidden;margin-bottom: 35px;">
											<div style="height: 32px;margin-bottom: 10px;line-height: 32px;">
												共有
												<span style="color: blue">{{total7}}</span>个素材
											</div>
											<div style="float: left;">
												<a-input-search
														placeholder="输入要搜索的标题或内容"
														@search="onSearch"
														v-model="name"
														:allowClear=true
														enterButton="搜索"
														style="width: 275px;"
												/>
												<a-button @click="clearInput" style="margin-left: 10px;">
													清空
												</a-button>
											</div>

											<a-button type="primary" @click="showModalText"
											          style="float: right;margin-right: 10px;" v-has="'material-add'">
												<a-icon type="plus"/>
												添加文本
											</a-button>
											<a-button type="primary" @click="importExcel"
											                     style="float: right;margin-right: 10px;" v-has="'material-add'">
												<a-icon type="plus"/>
												导入文本
											</a-button>
										</div>
									</div>
									<div
											style="margin: 100px;height: 400px;text-align: center;"
											v-show="total7 == 0?true:false"
									>
										<img
												src="../../../assets/null.png"
												style="width: 150px;display: block;margin: auto"
										/>
										<p style="text-align: center;">暂无数据</p>
									</div>
									<a-table v-show="total7 > 0" :columns="textColomns" :dataSource="materialList7"
									         :pagination="false"
									         class="text-table" ref="textTable"
									         style="margin: 30px 0px;" rowKey="id"
									         :rowClassName="rowClassName"
									         v-has="'material-list'">
										<span slot="checkedBox" slot-scope="text, record,index">
												<a-checkbox style="float: right"
												            v-hasMore2one="'material-remove,material-delete'"
												            v-model="checkBoxValue[index]"
												            @click="changeSelectKey(record.key)"></a-checkbox>
											</span>
										<span slot="content" slot-scope="text, record,index">
											<a-popover>
											    <template slot="content">
											        <p style="max-width: 700px;word-break:break-all;word-wrapL:break-word;" v-html="text.replace(/\n/g, '<br/>')"></p>
											    </template>
											    <div class="inputTitle2">
													<p v-html="text.replace(/\n/g, '<br/>')"></p>
												</div>
											</a-popover>

										</span>
										<span slot="action" slot-scope="text, record,index">
											<a-tooltip placement="top" v-has="'material-edit'">
												<template slot="title">
													编辑
												</template>
												<a-button type="link" @click="editText(index)"
												          v-has="'material-edit'">
													<a-icon type="edit"/>
												</a-button>
											</a-tooltip>
											<a-tooltip placement="top" style="margin-left: 5px;"
											           v-has="'material-remove'">
												<template slot="title">
													移动
												</template>
												<a-button type="link" @click="changeMaterial(record.id, record.group_id)"
												          v-has="'material-remove'">
													<a-icon type="retweet"/>
												</a-button>
											</a-tooltip>
											<a-tooltip placement="top"
											           style="margin-left: 5px;">
												<template slot="title">
													统计
												</template>
												<a-button type="link" @click="statistic(record.id, material_type)" v-has="'content-statistic'">
													<a-icon type="rise"/>
												</a-button>
												<!--												<a-icon type="rise" style="color: #01b065;cursor: pointer;"-->
												<!--												        @click="statistic(record.id, material_type)"/>-->
											</a-tooltip>
											<a-tooltip placement="top" style="margin-left: 5px;"
											           v-has="'material-delete'">
												<template slot="title">
													删除
												</template>
												<a-button type="link" @click="delText(record.id)">
													<a-icon type="delete"/>
												</a-button>
												<!--												<a-icon type="delete" style="color: #01b065;cursor: pointer;"-->
												<!--												        @click="delText(record.id)"/>-->
											</a-tooltip>
										</span>
									</a-table>
									<!-- 文本分页 -->
									<div style="width: 100%;padding: 0 20px 20px;" v-show="total7>0"
									     v-has="'material-list'">
										<div style="height: 32px;display: inline-block;line-height: 32px;margin-bottom: 10px;">
											<a-checkbox v-model="batchTypeValue"
											            @click="batchTypeChange"></a-checkbox>
											<a-select optionFilterProp="children"
											          v-model="batchType"
											          @change="changeBatchType" style="width: 150px; margin: 0 5px;">
												<a-select-option value="0">选择当前页</a-select-option>
												<a-select-option value="1">选择所有</a-select-option>
											</a-select>
											<a-button @click="batchMove" style="margin-right: 5px"
											          :disabled="selectedRowKeys.length == 0" v-has="'material-remove'">
												<a-icon type="retweet"/>
												批量移动
											</a-button>
											<a-button @click="batchDelete" :disabled="selectedRowKeys.length == 0"
											          v-has="'material-delete'">
												<a-icon type="delete"/>
												批量删除
											</a-button>
										</div>
										<div class="pagination" style="height: 32px;float: right;">
											<a-pagination
													:total="total7"
													showSizeChanger
													:showQuickJumper="quickJumper"
													:current="page7"
													:pageSize="pageSize7"
													:pageSizeOptions="['15','30','50','100']"
													@change="changePage7"
													@showSizeChange="showSizeChange7"
											/>
										</div>
									</div>
								</div>
							</a-spin>
						</div>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
		<!--添加图文弹窗-->
		<a-modal
				title="新增图文"
				width="720px"
				:visible="visibleSketchList"
				@ok="handleAddSketchList"
				:confirmLoading="confirmLoading"
				@cancel="handleCancelSketchList"
		>
			<a-form-item :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<template slot="label">
					选择分组
				</template>
				<a-tree-select
						style="width: 300px"
						:dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
						:treeData="groupList"
						placeholder='Please select'
						treeDefaultExpandAll
						v-model="selectGroupId"
				>
				</a-tree-select>
			</a-form-item>
			<div style="margin-top: 5px;" v-for="(sketch,sketchIndex) in sketchList">
				<!-- 图文新建 -->
				<!-- 图片封面 -->
				<!-- 选中前 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }"
				             v-show="sketch.closeShowModal3==false">
					<template slot="label"><span
							style="color: red">*</span>图片封面
					</template>
					<div class="upload-wrap" style="display: inline-block;"
					     @click="openShowModal(sketchIndex)">
						<a-icon type="plus" class="upload-plus"/>
					</div>
					<span style="vertical-align: bottom;">（图片大小不超过2M，支持JPG、JPEG及PNG格式）</span>
				</a-form-item>
				<!-- 选中后 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }"
				             v-show="sketch.closeShowModal3">
					<template slot="label"><span
							style="color: red">*</span>图片封面
					</template>
					<div class="upload-wrap">
						<img :src="commonUrl + sketch.local_path.img" alt=""
						     style="max-width: 100%;max-height: 100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);">
					</div>
					<span
							style="color: blue;position: absolute;bottom: 0;left: 110px;cursor: pointer;"
							@click="openShowModal(sketchIndex,sketch.material_id)">重新上传</span>
				</a-form-item>
				<!-- 填写标题 -->
				<a-form-item :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<template slot="label"><span
							style="color: red">*</span>填写标题
					</template>
					<a-input v-model="sketch.inputTitle"
					         :maxLength="32">
																<span slot="suffix">
                    <span>{{sketch.inputTitle.length}}</span>/32
                  </span>
					</a-input>
				</a-form-item>
				<!-- 添加描述 -->
				<a-form-item style="margin-top: 5px" :label-col="{ span: 3 }"
				             :wrapper-col="{ span: 21 }">
					<template slot="label">添加描述</template>
					<a-textarea placeholder="填写图文描述" :rows="4"
					            style="resize: none;"
					            v-model="sketch.digest"
					            :maxLength="128"/>
					<div style="float:right;">
						<span>{{sketch.digest.length}}</span>/128
					</div>
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
							v-model="sketch.content_source_url">
					</a-input>
					<!--					<a-button type="primary" ghost-->
					<!--					          style="margin-right: 15px;"-->
					<!--					          @click="addSketch()">-->
					<!--						<a-icon type="plus"/>-->
					<!--						添加图文-->
					<!--					</a-button>-->
					<a-button
							@click="deleteSketch(sketchIndex)">
						重置
					</a-button>
				</a-form-item>
			</div>
		</a-modal>

		<!-- 上传图片弹窗 -->
		<a-modal v-model="visible2" width="720px" title="新建图片素材" @cancel="cancelUploadPic">
			<template slot="footer">
				<a-button key="back" @click="cancelUploadPic">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading4"
						@click="uploadPic"
				>提交
				</a-button>
			</template>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					选择分组
				</template>
				<a-tree-select
						style="width: 300px"
						:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
						:treeData="groupList"
						placeholder='Please select'
						treeDefaultExpandAll
						v-model="selectGroupId"
				>
				</a-tree-select>
			</a-form-item>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					上传图片
				</template>
				<div>
					<a-upload
							action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							:multiple="true"
							:fileList="fileList"
							@change="handleChangePic"
					>
						<a-button><a-icon type="upload"/>点击上传</a-button>
					</a-upload>
					<span style="color: #AAA;font-size: 12px;display: inline-block;vertical-align: bottom;">（图片大小不超过2M，图片名不能重复，支持JPG、JPEG及PNG格式）</span>
					<p style="display: block;margin-bottom: 2px;line-height: 20px;" v-for="(item, index) in fileList">
						{{item.name}}
						<a-icon type="close" style="color: #F56C6C; cursor: pointer;" @click="deleteFileList(index)"></a-icon>
					</p>
				</div>
			</a-form-item>
		</a-modal>

		<!-- 上传音频弹窗 -->
		<a-modal v-model="voiceVisible" :destroyOnClose="true" title="新建音频素材" width="720px;" height='500px'
		         @cancel="cancelUploadVoice">
			<template slot="footer">
				<a-button key="back" @click="cancelUploadVoice">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading4"
						@click="uploadVoice"
				>提交
				</a-button>
			</template>
			<a-form-item :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<template slot="label">
					选择分组
				</template>
				<a-tree-select
						style="width: 300px"
						:dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
						:treeData="groupList"
						placeholder='Please select'
						treeDefaultExpandAll
						v-model="selectGroupId"
				>
				</a-tree-select>
			</a-form-item>
<!--			<a-form-item :label-col="{ span: 3 }"-->
<!--			             :wrapper-col="{ span: 21 }">-->
<!--				<template slot="label"><span-->
<!--						style="color: red">* </span>填写标题-->
<!--				</template>-->
<!--				<a-input v-model="voiceTitle"-->
<!--				         :maxLength="64">-->
<!--					<span slot="suffix">-->
<!--						<span>{{voiceTitle.length}}</span>/64-->
<!--                    </span>-->
<!--				</a-input>-->
<!--			</a-form-item>-->
			<a-form-item :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }" style="height: 200px;margin-top: 5px;">
				<template slot="label">
					<span style="color: red">* </span>上传音频
				</template>
				<!-- 文件未选中 -->
				<a-upload
						action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
						:multiple="true"
						:fileList="fileList"
						@change="handleChangeVoice"
				>
					<a-button><a-icon type="upload"/>点击上传</a-button>
				</a-upload>
				<span v-if="!voiceUrl" style="color: #AAA;font-size: 12px;display: inline-block;vertical-align: bottom;">（音频上传大小不超过2MB，播放长度不超过60s，支持AMR、MP3格式。）</span>
				<p style="display: block;margin-bottom: 2px;line-height: 20px;" v-for="(item, index) in fileList">
					{{item.name}}
					<a-icon type="close" style="color: #F56C6C; cursor: pointer;" @click="deleteFileList(index)"></a-icon>
				</p>
<!--				<div class="audio" style="display: inline-block;width: 100px;" v-if="voiceUrl" @click="playMusic1()">-->
<!--					<div class="box" style="float: left;">-->
<!--						<div class="wifi-symbol" v-if="!playVoice">-->
<!--							<div class="wifi-circle first"></div>-->
<!--							<div class="wifi-circle second"></div>-->
<!--							<div class="wifi-circle third"></div>-->
<!--						</div>-->
<!--						<div class="wifi-symbol" v-if="playVoice">-->
<!--							<div class="wifi-circle first"></div>-->
<!--							<div class="wifi-circle second1"></div>-->
<!--							<div class="wifi-circle third1"></div>-->
<!--						</div>-->
<!--						<audio ref="audio1" @canplay="oncanplay1">-->
<!--							<source-->
<!--									:src="voiceUrl"-->
<!--									type="audio/mp3"-->
<!--							/>-->
<!--						</audio>-->
<!--						&lt;!&ndash;						<div v-if="voiceName">&ndash;&gt;-->
<!--						&lt;!&ndash;							<span style="display: inline-block;margin-top: 36px;">{{voiceName}}</span>&ndash;&gt;-->
<!--						&lt;!&ndash;						</div>&ndash;&gt;-->
<!--						<div style="text-align: left;width: 100px;line-height: 10px;margin-top: 60px;">-->
<!--							{{playVoiceTime | dateFormat}}-->
<!--						</div>-->
<!--					</div>-->
<!--				</div>-->
<!--				&lt;!&ndash;				音频重新上传&ndash;&gt;-->
<!--				<a-upload-->
<!--						v-if="voiceUrl"-->
<!--						:showUploadList="false"-->
<!--						action=""-->
<!--						:beforeUpload="beforeUploadVoice"-->
<!--						:customRequest="selfUploadVoice"-->
<!--				>-->
<!--					&lt;!&ndash;					<div v-if="voiceName">&ndash;&gt;-->
<!--					&lt;!&ndash;						<span style="display: inline-block;margin-top: 30px;">{{voiceName}}</span>&ndash;&gt;-->
<!--					&lt;!&ndash;					</div>&ndash;&gt;-->
<!--					<div style="cursor: pointer;">-->
<!--						<div class="ant-upload-text;">重新上传</div>-->
<!--					</div>-->
<!--				</a-upload>-->
			</a-form-item>

		</a-modal>

		<!-- 上传视频弹窗 -->
		<a-modal v-model="videoVisible" title="新建视频素材" width="720px;" @cancel="cancelUploadVideo">
			<template slot="footer">
				<a-button key="back" @click="cancelUploadVideo">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading4"
						@click="uploadVideo"
				>提交
				</a-button>
			</template>
			<a-form-item :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<template slot="label">
					选择分组
				</template>
				<a-tree-select
						style="width: 300px"
						:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
						:treeData="groupList"
						placeholder='Please select'
						treeDefaultExpandAll
						v-model="selectGroupId"
				>
				</a-tree-select>
			</a-form-item>
			<a-form-item style="margin-top: 5px;" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<template slot="label">
					上传视频
				</template>
				<!-- 文件未选中 -->
				<a-upload
						action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
						:multiple="true"
						:fileList="fileList"
						@change="handleChangeVedio"
				>
					<a-button><a-icon type="upload"/>点击上传</a-button>
				</a-upload>
				<span style="color: #AAA;font-size: 12px;display: inline-block;vertical-align: bottom;">（视频上传大小不超过10M，支持MP4格式。）</span>
				<p style="display: block;margin-bottom: 2px;line-height: 20px;" v-for="(item, index) in fileList">
					{{item.name}}
					<a-icon type="close" style="color: #F56C6C; cursor: pointer;" @click="deleteFileList(index)"></a-icon>
				</p>
			</a-form-item>

		</a-modal>

		<!-- 添加小程序弹窗 -->
		<a-modal v-model="miniprogramVisible" :title="appletTitle" width="720px;" @cancel="cancelUploadMiniprogram">
			<template slot="footer">
				<a-button key="back" @click="cancelUploadMiniprogram">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading4"
						@click="uploadMiniprogram"
				>提交
				</a-button>
			</template>
			<div style="width: 55%; float: left">
				<div class="content-msg1">
					<p style="margin-bottom: 2px;">
						在企业微信里发送小程序（必须在微信公众平台通过审核和发布的），请先将其关联到企业微信（
						<a target="_blank" href="https://support.qq.com/products/104790/faqs/61672">
							如何关联</a>
						），再到本系统添加该小程序，否则发送失败，客户接收不到。
					</p>
					<p style="margin-bottom: 2px;">
						如果没有微信小程序，请前往微信小程序进行注册。
						<a target="_blank" href="https://mp.weixin.qq.com/cgi-bin/wx">
							立即前往
						</a>
					</p>
					<p style="margin-bottom: 0px;color: #ff562D;">
						通过聊天侧边栏发送小程序，员工请先将企业微信APP升级至3.1.0及以后版本，小程序路径必须以“.html”结尾。
					</p>
				</div>
				<a-form-item :label-col="{ span: 6 }"
				             :wrapper-col="{ span: 18 }">
					<template slot="label">
						选择分组
					</template>
					<a-tree-select
							style="width: 300px"
							:dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
							:treeData="groupList"
							placeholder='Please select'
							treeDefaultExpandAll
							v-model="selectGroupId"
					>
					</a-tree-select>
				</a-form-item>
				<a-form-item :label-col="{ span: 6 }"
				             :wrapper-col="{ span: 18 }">
					<template slot="label">
						<span style="color: red">* </span>小程序appID
					</template>
					<a-input :disabled='appletDisabled' placeholder="请填写小程序AppID"
					         v-model="miniprogram1.appId"></a-input>
				</a-form-item>
				<a-form-item :label-col="{ span: 6 }"
				             :wrapper-col="{ span: 18 }">
					<template slot="label">
						<span style="color: red">* </span>小程序路径
					</template>
					<a-input v-model="miniprogram1.linkUrl" placeholder="必须以“.html”结尾，例如：pages/index.html"></a-input>
				</a-form-item>
				<a-form-item :label-col="{ span: 6 }"
				             :wrapper-col="{ span: 18 }">
					<template slot="label">
						<span style="color: red">* </span>卡片标题
					</template>
					<a-input v-model="miniprogram1.title"
					         :maxLength="12" placeholder="请填写小程序标题（4-12个字符）" @blur="checkout(miniprogram1.title)">
						<span slot="suffix">
							<span>{{miniprogram1.title.length}}</span>/12
	                    </span>
					</a-input>
				</a-form-item>
				<!-- 选中前 -->
				<a-form-item :label-col="{ span: 6 }"
				             :wrapper-col="{ span: 18 }"
				             v-show="miniprogram1.local_path.img == ''">
					<template slot="label">
						<span style="color: red">* </span>卡片图片
					</template>
					<div style="color: rgba(0, 0, 0, 0.4);line-height: 17px;margin: 11px 0;">
						上传图片不超过1M，尺寸必须为1080*864像素，支持jpg/jpeg/png格式
					</div>
					<div class="upload-wrap"
					     @click="openShowModal(-1)">
						<a-icon type="plus" class="upload-plus"/>
					</div>
				</a-form-item>
				<!-- 选中后 -->
				<a-form-item label="图片封面" :label-col="{ span: 6 }"
				             :wrapper-col="{ span: 18 }"
				             v-show="miniprogram1.local_path.img != ''">
					<div class="upload-wrap">
						<img :src="commonUrl + miniprogram1.local_path.img" alt=""
						     style="max-width: 100%;max-height: 100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);">
					</div>
					<span
							style="color: blue;position: absolute;bottom: 0;left: 110px;cursor: pointer;"
							@click="openShowModal(-1,miniprogram1.material_id)">重新上传</span>
				</a-form-item>
			</div>
			<div style="float: right; width: 45%;">
				<div style="margin: 0 auto; vertical-align: middle; width: 240px; height: 284px; border: 1px solid #E2E2E2;border-radius: 3px;">
					<p style="padding: 5px 10px 0px 10px; margin-bottom: 0px;height: 35px; line-height: 35px;">
						<img style="width: 18px;height: 18px; border-radius: 50%;" src="../../../assets/pigcms.png"/>
						<span style="margin-left: 5px; font-size: 12px; color: rgba(0,0,0,0.4)">轻小店</span>
					</p>
					<p style="padding: 5px 10px 0px 10px;margin-bottom: 0px;">这里有很多优惠哦~~</p>
					<div style="padding: 5px 10px 0px 10px;">
						<img src="../../../assets/fileicon.png" style="width: 220px;height: 182px"/>
					</div>
					<div style="padding: 2px 10px;border-top: 1px solid #E2E2E2;margin-top: 8px;">
						<MyIcon type="icon-miniapp"></MyIcon>
						<span style="margin-left: 5px">小程序</span>
					</div>
				</div>
				<div style="margin: 0;text-align: center;margin-top: 10px;">示例</div>
			</div>
		</a-modal>

		<!-- 上传文件 -->
		<a-modal v-model="fileVisible" title="新建文件素材" width="720px" @click="cancelUploadFile">
			<template slot="footer">
				<a-button key="back" @click="cancelUploadFile">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading4"
						@click="uploadFile"
				>提交
				</a-button>
			</template>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					选择分组
				</template>
				<a-tree-select
						style="width: 300px"
						:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
						:treeData="groupList"
						placeholder='Please select'
						treeDefaultExpandAll
						v-model="selectGroupId"
				>
				</a-tree-select>
			</a-form-item>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					上传文件
				</template>
				<div style="margin: 5px 0px;">
					<a-upload
							action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							:multiple="true"
							:fileList="fileList"
							@change="handleChangeFile"
					>
						<a-button><a-icon type="upload"/>点击上传</a-button>
					</a-upload>
					<span style="color: #AAA;line-height: 20px;font-size: 12px;display: inline-block;vertical-align: bottom;">（上传文件大小不超过20MB，支持DOC、DOCX、XLS、XLSX、CSV、PPT、PPTX、TXT、PDF及Xmind格式。）</span>
					<p style="display: block;margin-bottom: 2px;line-height: 20px;" v-for="(item, index) in fileList">
						{{item.name}}
						<a-icon type="close" style="color: #F56C6C; cursor: pointer;" @click="deleteFileList(index)"></a-icon>
					</p>
				</div>
			</a-form-item>
		</a-modal>

		<!-- 添加文本 -->
		<a-modal v-model="textVisible" :title="textTitle" width="720px" @cancel="cancelUploadText">
			<template slot="footer">
				<a-button key="back" @click="cancelUploadText">取消</a-button>
				<a-button
						key="submit"
						type="primary"
						:loading="loading4"
						@click="uploadText"
				>提交
				</a-button>
			</template>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					选择分组
				</template>
				<a-tree-select
						style="width: 500px"
						:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
						:treeData="groupList"
						placeholder='Please select'
						treeDefaultExpandAll
						v-model="selectGroupId"
				>
				</a-tree-select>
			</a-form-item>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					文本标题
				</template>
				<a-input v-model="text_title" placeholder="请填写文本标题，仅供备注，不会发送给客户" :maxLength="50"
				         style="width: 500px;"/>
				<span style="display: inline-block; width: 50px; margin-left: 10px;">{{text_title === null ? 0 : text_title.length}} / 50</span>
			</a-form-item>
			<a-form-item :label-col="{ span: 4 }"
			             :wrapper-col="{ span: 20 }">
				<template slot="label">
					文本内容
				</template>
				<div style="margin: 5px 0px;">
					<medium-editor ref="medium_editor"
					               class="content-editable"
					               :text="textValue"
					               :options="options" @editorCreated="editorCreated"
					               @edit="changeContentInput" custom-tag="div"/>

				</div>
				<div style="padding: 0 15px;">
					点击插入：
					<a-popover trigger="click" :destroyTooltipOnHide="true"
					           v-model="emojiShow">
						<VEmojiPicker slot="content"
						              :showSearch="false"
						              @select="onSelectEmoji"/>
						<a-icon type="smile" class="icon-btn"
						        style="cursor: pointer;"/>
					</a-popover>
					<div style="float: right;">
						{{wordNum}}/{{wordLimit}}
					</div>
				</div>
			</a-form-item>
		</a-modal>

		<!-- 分组弹窗 -->
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
		<!-- 选择图片弹窗 -->
		<ChoosePic :show="showModal3" :comefrom='comefrom'
		           :callback="modalVisibleChange2" :groupId=this.groupId type="1" :chooseId="chooseId"></ChoosePic>
		<!--		公众号弹窗-->
		<wxModal :show="showWxModal" :material_type="material_type" source="'1'"
		         :callback="modalVisibleChange"></wxModal>
		<!-- 图文预览 -->
		<a-modal v-model="qrcodeVisible" @ok="handleQrCode" @cancel="handleCancelQrCode">
			<div style="padding: 20px 0; width: 140px;margin: 0 auto;" ref="qrcode" id="qrcode">

			</div>
		</a-modal>
		<!-- 小程序封面图片裁剪 -->
		<cropperModal ref="cropper" @ok="uploadAppletPic" @cancel="cancleAppletPic"></cropperModal>
		<!-- 上传文本表格弹窗 -->
		<a-modal
				title="上传表格"
				v-model="textImportVisible"
				@cancel="handleCancelText"
				@ok="handleOkText"
				width="750px"
				:confirmLoading="modalLoading">
			<div style="padding: 10px 0px;min-height: 300px;overflow: auto;">
				<div style="color:red;">为了避免导入时出现等待时间过长，建议单次上传不超过5000条，最多可支持1万条。</div>
				<!-- 选择表格 -->
				<a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
					<span slot="label">
	                    <span style="color: red;"> * </span>选择表格
	                </span>
					<a-upload
							name="avatar"
							:showUploadList="false"
							action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							:beforeUpload="beforeUploadText"
					>
						<a-button type="primary"
						          style="height: 28px;font-size: 14px;">上传Excel
						</a-button>
					</a-upload>
					<template v-if="fileName != ''">
						<span style="margin-left: 5px;">{{fileName}}</span>
						<a-icon type="close-circle" style="vertical-align: text-top;margin-left: 3px;"
						        @click="closeExcel"/>
					</template>
					<div style="line-height: normal;margin-bottom: 20px;color: #999;">下载<a
							:href="$store.state.commonUrl + '/upload/import_attachment.xlsx'">Excel模板</a>。<span>请按照模板的要求上传话术，若有空行将会自动过滤。</span>
					</div>
				</a-form-item>
			</div>
		</a-modal>
		<!-- 进度条弹窗 -->
		<a-modal v-model="progressVisible" title="上传进度" :footer="false" :closable="false" :maskClosable="false"
		         :maskStyle="{'left':leftSiderWidth}" :wrapClassName="'mask-dialog'">
			<div style="text-align: center;">
				<a-progress stroke-linecap="square" :percent="progressNum" type="circle"/>
				<div>
					<img src="../../../assets/loadingGif.gif" alt="">
				</div>
				<p style="margin: 0 auto 20px;">已成功上传{{successNum}}个文本，失败{{failNum}}个文本，还有{{notImportNum}}个文本待上传</p>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";
	import ChoosePic from "@/components/ChoosePic.vue"
	import {videoPlayer} from "vue-video-player"
	import team from '../../../components/fileTeam'
	import FileMenu from '../../../components/foldMenu/FileMenu'
	import "video.js/dist/video-js.css"
	import editor from 'vue2-medium-editor'
	import vuedraggable from "vuedraggable"
	import wxModal from "@/components/WxModal.vue"
	import WEmoji from "@/common/js/wechatEmoji.js"
	import axios from 'axios'
	import QRCode from 'qrcodejs2'
	import cropperModal from '../../../components/picCropper/CropperModal'
	import { VEmojiPicker } from "v-emoji-picker"
	import MyIcon from "@/components/MyIcon.vue"
	import moment from "moment"

	const CancelToken = axios.CancelToken
	const source = CancelToken.source()

	function getBase64 (img, callback) {
		const reader = new FileReader();
		reader.addEventListener("load", () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	let self = {}
	export default {
		name: "filingCabinetList",
		components: {
			vuedraggable,
			videoPlayer,
			team,
			FileMenu,
			ChoosePic,
			wxModal,
			'medium-editor': editor,
			cropperModal,
			VEmojiPicker,
			MyIcon
		},
		inject    : ['getFileType'],
		data () {
			let thisGlobal = this.global
			let that = this
			let MiniProgramButton = editor.MediumEditor.Extension.extend({
				name: "miniProgram",

				init: function (options) {
					this.button = this.document.createElement("button");
					this.button.classList.add(
						"medium-editor-action",
						"medium-editor-miniprogram-action"
					);
					this.button.innerHTML = "设置小程序";

					this.on(this.button, "click", this.handleClick.bind(this));
				},

				getButton: function () {
					return this.button;
				},

				getInstance: function () {
					return this;
				},

				handleClick: function (event) {
					let currentMediumEditor = that.mediumEditor
					currentMediumEditor.saveSelection();

					const toolbarWidth = this.button.parentElement.parentElement.clientWidth;
					const toolbarHeight = this.button.parentElement.parentElement.clientHeight;

					this.addMiniProgramForm();

					let domMiniProgram = this.button.parentElement.parentElement.nextSibling.nextSibling
					const miniProgramWidth = 336;
					const miniProgramHeight = domMiniProgram.clientHeight;
					const domLeft = (toolbarWidth - miniProgramWidth) / 2;
					const domTop = toolbarHeight - miniProgramHeight + 2; // 加 2 是为了消除底部的重叠区域

					domMiniProgram.style.cssText =
						"display: block; visibility: visible; left: " + domLeft + "px; top: " + domTop + "px; width: " + miniProgramWidth + "px; position:absolute;";

					this.on(
						this.document.getElementById("miniSave"),
						"click",
						function (e) {
							let inpValue1 = this.button.parentElement.parentElement.nextSibling.nextSibling.firstChild.children[0].value
							let inpValue2 = this.button.parentElement.parentElement.nextSibling.nextSibling.firstChild.children[1].value
							let inpValue3 = this.button.parentElement.parentElement.nextSibling.nextSibling.firstChild.children[2].value

							var reg = /href="(?![a-zA-z]+:\/\/)[^"]*/g
							if (inpValue1 == '' || inpValue2 == '' || inpValue3 == '') {
								message.error("请填写小程序相关信息");
								return false
							} else if (reg.test(inpValue3)) {
								message.error("备用网页错误或不存在");
								return false
							} else {
								currentMediumEditor.restoreSelection()
								currentMediumEditor.execAction("unlink")

								thisGlobal.createMiniPLink({
									url : inpValue3,
									data: {
										miniprogramappid: inpValue1,
										miniprogrampath : inpValue2
									}
								}, currentMediumEditor)
								currentMediumEditor.trigger("editableInput", {}, currentMediumEditor.origElements);


								domMiniProgram.parentElement.removeChild(
									this.document.getElementById(
										"medium-editor-toolbar-form-miniProgram"
									)
								)
							}
						}.bind(this)
					);

					this.on(
						this.document.getElementById("miniClose"),
						"click",
						function (e) {
							domMiniProgram.parentElement.removeChild(
								this.document.getElementById(
									"medium-editor-toolbar-form-miniProgram"
								)
							);
						}.bind(this)
					);
				},

				addMiniProgramForm: function () {
					let miniProgramForm = this.document.createElement("div");
					miniProgramForm.classList.add("medium-editor-toolbar-miniProgram", "medium-editor-toolbar-form", "medium-editor-toolbar-form-active");
					miniProgramForm.style.padding = "10px";
					miniProgramForm.style.width = "410px";
					miniProgramForm.id = "medium-editor-toolbar-form-anchor-miniProgram";
					miniProgramForm.innerHTML = [
						'<input type="text" class="medium-editor-toolbar-input miniProgram-appid-input miniProgram-inp1" placeholder="填写小程序AppID，跳转小程序需与当前公众号绑定关联关系" style="display: block;width: 400px;">',
						'<input type="text" class="medium-editor-toolbar-input miniProgram-path-input miniProgram-inp2" placeholder="填写小程序路径，例如：pages/index" style="display: block;width: 400px;">',
						'<input type="text" class="medium-editor-toolbar-input miniProgram-url-input miniProgram-inp3" placeholder="备用网页，以http://或https://开头" style="display: block;width: 400px;">',
						'<div class="btn-wrap" style="overflow: hidden;"><div style="float: right;"><a href="#" id="miniSave" class="medium-editor-toolbar-save">✓</a><a href="#" id="miniClose" class="medium-editor-toolbar-close">×</a></div></div>'
					].join("");

					let miniProgramWrap = this.document.createElement("div");
					miniProgramWrap.classList.add("medium-editor-toolbar-miniProgram-wrap");
					miniProgramWrap.id = "medium-editor-toolbar-form-miniProgram";
					miniProgramWrap.appendChild(miniProgramForm);

					this.button.parentElement.parentElement.parentElement.appendChild(miniProgramWrap);
				}
			})
			return {
				// 同步按钮的loading
				allPage           : 1,
				allPageSize       : 15,
				allMaterialList   : [], //所有类型素材
				material          : {},
				previewAllVisible : false,
				allTotal          : 0,
				allFileType       : 0,
				allColomns        : [
					{
						title      : "",
						dataIndex  : "checkedBox",
						key        : "checkedBox",
						width      : '40px',
						scopedSlots: {customRender: "checkedBox"}
					},
					{
						title      : "标题",
						dataIndex  : "file_name",
						key        : "file_name",
						width      : '180px',
						scopedSlots: {customRender: "file_name"}
					},
					{
						title      : "内容",
						dataIndex  : "content",
						key        : "content",
						width      : '300px',
						scopedSlots: {customRender: "content"}
					},
					{
						title    : "上传者",
						dataIndex: "user_name",
						key      : "user_name",
						width    : '180px'
					},
					{
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px'
					},
					{
						title      : "类型",
						dataIndex  : "typeName",
						key        : "typeName",
						scopedSlots: {customRender: "typeName"}
					},
					{
						title    : "添加时间",
						dataIndex: "create_time",
						key      : "create_time",
					},
					{
						title      : "操作",
						dataIndex  : "action",
						key        : "action",
						width      : '25%',
						scopedSlots: {customRender: "action"}
					}
				],
				sketchWxLoading   : false, // 图文
				picWxLoading      : false, // 图本
				voiceWxLoading    : false, // 音频
				videoWxLoading    : false, // 视频
				materialKeys      : [],    // 所有当前素材的key
				selectedRowKeys   : [],    // 选中的素材key
				checkBoxValue     : [],    // 多选框是否选中
				batchFlag         : 1,     // 是否是批量移动
				batchType         : '1',     // 0当前页 1所有
				batchTypeValue    : false, // 当前页/所有 是否选中
				showModal3        : false, // 选择素材弹窗
				typeValue2        : 1,  // 2 图片
				news_type         : 0,  // 1 单图文 2 多图文
				sketchType        : '0', // 0图文卡片展示 1图文列表展示
				showType          : '0', // 非图文文本  0卡片展示 1.列表展示
				chooseId          : 0,  // 选中的素材id
				currentSketch     : 0,  // -1 小程序图片封面 非-1 当前选中的图文封面
				isLoading         : true, //Loading 组件显示与隐藏
				groupId           : [], // 选中的小组id
				isMoveType        : [], // 是否是渠道码 ""不是 1~6是
				materialList      : [],//图文素材列表
				single            : [], //单图文列表
				double            : [], //多图文列表
				materialListTotal : 0, //图文素材列表总条数
				visibleSketchList : false, //新增图文弹窗
				sketchList        : [
					{
						inputTitle        : '',//标题
						digest            : '',//图文描述
						content_source_url: '',//跳转链接
						material_id       : '',
						local_path        : {
							img  : require('../../../assets/img.png'),
							audio: ""
						},
						closeShowModal3   : false,//每个图文消息是否选好素材
					}
				], // 图文列表，目前是单图文，取[0]即可
				page2             : 1, // 图文卡片分页
				pageSize2         : 16, // 图文卡片页码
				sketchPage        : 1, // 图文列表分页
				sketchPageSize    : 15, // 图文列表页码
				sketchColomns     : [
					{
						title      : "",
						dataIndex  : "checkedBox",
						key        : "checkedBox",
						width      : '40px',
						scopedSlots: {customRender: "checkedBox"}
					},
					{
						title    : "标题",
						dataIndex: "file_name",
						key      : "file_name",
						width    : '180px',
						scopedSlots: {customRender: "file_name"}
					},
					{
						title      : "内容",
						dataIndex  : "content",
						key        : "content",
						width      : "40%",
						scopedSlots: {customRender: "content"}
					},
					{
						title    : "上传者",
						dataIndex: "username",
						key      : "username",
					},
					{
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px',
					},
					{
						title    : "添加时间",
						dataIndex: "create_time",
						key      : "create_time",
					},
					{
						title      : "操作",
						dataIndex  : "action",
						key        : "action",
						width      : '25%',
						scopedSlots: {customRender: "action"}
					}
				],
				qrcodeVisible     : false, // 预览二维码
				confirmLoading    : false, //新增图文确定loading
				materialList2     : [], //图片素材列表
				materialList3     : [], //视频素材列表
				materialList4     : [], //音频素材列表
				material_type     : '0', //4图文，1图片，2音频，3视频, 7小程序，5文件，6文本
				lastTime          : "", //最后同步时间
				visible           : false, //手机预览弹窗显示与隐藏
				loading3          : false, //手机预览确定按钮加载显示与隐藏
				inputUsername     : "", //手机预览输入的微信号
				materialId        : "", //素材id
				visible2          : false, //上传图片弹窗显示与隐藏
				loading4          : false, //上传图片弹窗加载显示与隐藏
				//上传图片
				imageUrl          : "",
				defaultValue      : 1, //默认上传素材类型，1为永久，0为临时
				imageColomns      : [
					{
						title      : "",
						dataIndex  : "checkedBox",
						key        : "checkedBox",
						width      : '40px',
						scopedSlots: {customRender: "checkedBox"}
					},
					{
						title    : "标题",
						dataIndex: "file_name",
						key      : "file_name",
						width    : '180px'
					},
					{
						title      : "内容",
						dataIndex  : "content",
						key        : "content",
						scopedSlots: {customRender: "content"}
					},
					{
						title    : "上传者",
						dataIndex: "username",
						key      : "username",
						width    : '180px'
					},
					{
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px'
					},
					{
						title    : "添加时间",
						dataIndex: "create_time",
						key      : "create_time",
					},
					{
						title      : "操作",
						dataIndex  : "action",
						key        : "action",
						width      : '25%',
						scopedSlots: {customRender: "action"}
					}
				],
				fileInfo          : {}, //上传图片的文件信息
				previewVisible    : false, //预览图片的弹窗显示与隐藏
				previewUrl        : this.$store.state.commonUrl + "/upload/previw.png", //预览图片地址
				name              : "", //图片标题
				page              : 1, //图片素材页数
				pageSize          : 15, //图片素材每页个数
				total             : 0, //图片素材总条数
				quickJumper       : false, // 是否显示快速跳转的控件
				voiceColomns      : [
					{
						title      : "",
						dataIndex  : "checkedBox",
						key        : "checkedBox",
						width      : '40px',
						scopedSlots: {customRender: "checkedBox"}
					},
					{
						title    : "标题",
						dataIndex: "file_name",
						key      : "file_name",
						width    : '180px'
					},
					{
						title      : "内容",
						dataIndex  : "content",
						key        : "content",
						scopedSlots: {customRender: "content"}
					},
					{
						title    : "上传者",
						dataIndex: "username",
						key      : "username",
					},
					{
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px'
					},
					{
						title    : "添加时间",
						dataIndex: "create_time",
						key      : "create_time",
					},
					{
						title      : "操作",
						dataIndex  : "action",
						key        : "action",
						width      : '20%',
						scopedSlots: {customRender: "action"}
					}
				],
				page3             : 1, //音频素材页数
				pageSize3         : 15, //音频素材每页个数
				total3            : 0, //音频素材总条数
				quickJumper3      : false, //音频素材是否显示快速跳转的控件
				page4             : 1, //视频素材页数
				pageSize4         : 15, //视频素材每页个数
				total4            : 0, //视频素材总条数
				quickJumper4      : false, //视频素材是否显示快速跳转的控件
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
				playerOptions     : [],
				playTime          : [], //音频播放时间
				t1                : [],
				voiceVisible      : false, // 上传音频弹窗显示与隐藏
				t2                : '', // 上传音频播放计时器参数
				playVoice         : false,
				voiceTitle        : '',
				playVoiceTime     : '',
				voiceName         : '', // 音频文件名称
				voiceUrl          : '', // 音频src
				videoVisible      : false, // 上传音频弹窗
				playerVideoOptions: {}, // 视频播放配置
				videoTitle        : '', // 上传视频标题
				videoUrl          : '', // 视频src
				clickIndex        : -1, //点击的音频序号，控制喇叭的显示与隐藏
				commonUrl         : this.$store.state.commonUrl,//公共的链接
				col               : 4,//图文瀑布流分几列
				is_pull           : 0,//检查24小时内是否能同步，0同步，1检查
				materialList5     : [], // 小程序素材
				appletColomns     : [
					{
						title      : "",
						dataIndex  : "checkedBox",
						key        : "checkedBox",
						width      : '40px',
						scopedSlots: {customRender: "checkedBox"}
					},
					{
						title    : "标题",
						dataIndex: "file_name",
						key      : "file_name",
						width    : '180px'
					},
					{
						title      : "卡片封面",
						dataIndex  : "content",
						key        : "content",
						scopedSlots: {customRender: "content"}
					},
					{
						title    : "上传者",
						dataIndex: "username",
						key      : "username",
						width    : '180px'
					},
					{
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px'
					},
					{
						title    : "添加时间",
						dataIndex: "create_time",
						key      : "create_time",
					},
					{
						title      : "操作",
						dataIndex  : "action",
						key        : "action",
						width      : '25%',
						scopedSlots: {customRender: "action"}
					}
				],
				miniprogramVisible: false, // 小程序弹窗是否显示
				appletDisabled    : false, //小程序弹窗部分禁选
				appletTitle       : '新建小程序素材',
				miniprogram       : {
					appId      : '1',
					linkUrl    : '',
					title      : '',
					material_id: '',
					local_path : {
						img  : require('../../../assets/img.png'),
						audio: ""
					},
				}, // 文本链配置小程序
				miniprogram1      : {
					appId      : '',
					linkUrl    : '',
					title      : '',
					material_id: '',
					local_path : {
						img  : "",
						audio: ""
					},
				}, // 上传小程序
				page5             : 1, //小程序素材页数
				pageSize5         : 15, //小程序素材每页个数
				total5            : 0, //小程序素材总条数
				quickJumper5      : false,
				materialList6     : [], // 文件素材
				fileColomns       : [
					{
						title      : "",
						dataIndex  : "checkedBox",
						key        : "checkedBox",
						width      : '40px',
						scopedSlots: {customRender: "checkedBox"}
					},
					{
						title    : "文件名",
						dataIndex: "file_name",
						key      : "file_name",
						width    : "15%",
					},
					{
						title    : "上传者",
						dataIndex: "username",
						key      : "username",
						// width    : 20,
					},
					{
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px'
					},
					{
						title    : "添加时间",
						dataIndex: "create_time",
						key      : "create_time",
						// width    : 20,
					},
					{
						title      : "操作",
						dataIndex  : "action",
						key        : "action",
						width      : '20%',
						scopedSlots: {customRender: "action"}
					}
				],
				fileVisible       : false, // 上传文件弹窗
				fileName          : '', // 上传文件名
				page6             : 1, //文件素材页数
				pageSize6         : 15, //文件素材每页个数
				total6            : 0, //文件素材总条数
				quickJumper6      : false,
				textColomns       : [
					{
						title      : "",
						dataIndex  : "checkedBox",
						key        : "checkedBox",
						width      : '40px',
						scopedSlots: {customRender: "checkedBox"}
					},
					{
						title    : "标题",
						dataIndex: "file_name",
						key      : "file_name",
						width    : "180px",
					},
					{
						title      : "内容",
						dataIndex  : "content",
						key        : "content",
						width      : "25%",
						scopedSlots: {customRender: "content"}
					},
					{
						title    : "上传者",
						dataIndex: "username",
						key      : "username",
						width    : "180px",
					},
					{
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px'
					},
					{
						title    : "添加时间",
						dataIndex: "create_time",
						key      : "create_time",
						// width    : 20,
					},
					{
						title      : "操作",
						dataIndex  : "action",
						key        : "action",
						width      : '25%',
						scopedSlots: {customRender: "action"}
					}
				], // 文本表格列
				materialList7     : [
					{
						id         : 123,
						content    : '3e2<a href="https://baidu.com">qewa</a>das\n',
						user       : 'bwwang',
						create_time: '2020-1-7'
					}, {
						id         : 234,
						content    : 'ceshi',
						user       : 'bwwang',
						create_time: '2020-1-7'
					}
				], // 文本
				textVisible       : false, // 添加文本弹窗
				textImportVisible       : false, // 导入文本弹窗
				progressVisible    : false, // 进度条弹窗
				progressNum        : 0,//进度条进度
				leftSiderWidth     : document.getElementsByClassName('menu-sider')[0].style.width,
				successNum         : 0,//文本上传数
				failNum            : 0,//文本失败上传数
				notImportNum       : 0,//文本待上传数
				modalLoading      : false,
				mediumEditor      : [],   // 初始化的medium-editor
				emojiShow         : false, // emoji 表情选择框是否显示
				options           : {
					toolbar      : false,
					// 	{
					// 	buttons: [
					// 		{
					// 			name          : "anchor",
					// 			contentDefault: "设置链接"
					// 		},
					// 		{
					// 			name: "miniProgram"
					// 		},
					// 		{
					// 			name          : "removeFormat",
					// 			action        : "unlink",
					// 			contentDefault: "移除链接"
					// 		}
					// 	]
					// },
					anchor       : {
						linkValidation : true,
						placeholderText: "输入链接，以http://或https://开头"
					},
					placeholder  : {
						text: ""
					},
					anchorPreview: false,
					extensions   : {
						miniProgram: new MiniProgramButton({})
					},
					paste        : {
						forcePlainText : true,
						cleanPastedHTML: true,
						cleanAttrs     : ['class', 'style', 'dir', 'align', 'width', 'height', 'face', 'title', 'code', 'name', 'id', 'type', 'span', 'border', 'open', 'action', 'method', 'cols', 'for', 'rel', 'label', 'icon', 'value', 'max', 'min', 'classid']
					}
				},  // 文本链配置
				wordNum           : 0,//编辑框的字数
				wordLimit         : 1000, //  编辑框文字限制
				textContent       : '',//编辑框传给后台的内容
				textValue         : '', //文本内容
				page7             : 1, //文本素材页数
				pageSize7         : 15, //文本素材每页个数
				total7            : 2, //文本素材总条数
				textTitle         : '', // 文本弹窗标题
				text_title        : '',//文本弹窗新建标题
				quickJumper7      : false,
				// 分组弹窗
				groupVisible      : false,
				attachmentId      : '', // 附件id
				groupList         : [], // 小组列表
				group             : '', // 同步分组弹窗的小组id
				groupLoading      : false, // 提交按钮loding
				// 公众号弹窗
				showWxModal       : false,
				// 上传选择的分组id
				selectGroupId     : '',
				fileList          : [],
				sidebarVisible    : false,//添加到企微侧边栏弹窗的显示与隐藏
				comefrom          : ''
			};
		},

		methods: {
			// 列表选择
			onSelectChange (selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys
			},
			// 卡片选择
			changeSelectKey (key) {
				for (let i = 0; i < this.selectedRowKeys.length; i++) {
					if (key == this.selectedRowKeys[i]) {
						this.selectedRowKeys.splice(i, 1)
						this.setBox()
						return false
					}
				}
				this.selectedRowKeys.push(key)
				this.setBox()
			},
			// 当前页多选框变化
			batchTypeChange () {
				if (!this.batchTypeValue) {
					// 添加
					if (this.batchType == 0) {
						// 当前页
						if(this.material_type == 0) {
							this.addKey(this.allMaterialList)
							this.setCheckedBox(this.allMaterialList)
						} else if (this.material_type == 1) {
							this.addKey(this.materialList2)
							this.setCheckedBox(this.materialList2)
						} else if (this.material_type == 2) {
							this.addKey(this.materialList3)
							this.setCheckedBox(this.materialList3)
						} else if (this.material_type == 3) {
							this.addKey(this.materialList4)
							this.setCheckedBox(this.materialList4)
						} else if (this.material_type == 4) {
							this.addKey(this.materialList)
							this.setCheckedBox(this.materialList)
						} else if (this.material_type == 5) {
							this.addKey(this.materialList6)
							this.setCheckedBox(this.materialList6)
						} else if (this.material_type == 6) {
							this.addKey(this.materialList7)
							this.setCheckedBox(this.materialList7)
						} else if (this.material_type == 7) {
							this.addKey(this.materialList5)
							this.setCheckedBox(this.materialList5)
						}
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = [...this.materialKeys.valueOf()]
						this.setBox()
					}
					this.batchTypeValue = true
				} else {
					// 移除
					if (this.batchType == 0) {
						// 当前
						if (this.material_type == 0) {
							this.removeKey(this.allMaterialList)
							this.setCheckedBox(this.allMaterialList)
						} else if (this.material_type == 1) {
							this.removeKey(this.materialList2)
							this.setCheckedBox(this.materialList2)
						} else if (this.material_type == 2) {
							this.removeKey(this.materialList3)
							this.setCheckedBox(this.materialList3)
						} else if (this.material_type == 3) {
							this.removeKey(this.materialList4)
							this.setCheckedBox(this.materialList4)
						} else if (this.material_type == 5) {
							this.removeKey(this.materialList6)
							this.setCheckedBox(this.materialList6)
						} else if (this.material_type == 7) {
							this.removeKey(this.materialList5)
							this.setCheckedBox(this.materialList5)
						}
					} else if (this.batchType == 1) {
						// 所有
						this.selectedRowKeys = []
						this.setBox()
					}
					this.batchTypeValue = false
				}
			},
			setBox() {
				if(this.material_type == 0) {
					this.setCheckedBox(this.allMaterialList)
				} else if (this.material_type == 1) {
					this.setCheckedBox(this.materialList2)
				} else if (this.material_type == 2) {
					this.setCheckedBox(this.materialList3)
				} else if (this.material_type == 3) {
					this.setCheckedBox(this.materialList4)
				} else if (this.material_type == 4) {
					this.setCheckedBox(this.materialList)
				} else if (this.material_type == 5) {
					this.setCheckedBox(this.materialList6)
				} else if (this.material_type == 6) {
					this.setCheckedBox(this.materialList7)
				} else if (this.material_type == 7) {
					this.setCheckedBox(this.materialList5)
				}
			},
			// 当前/所有 类型选择框变化
			changeBatchType () {
				if(this.batchTypeValue) {
					if(this.batchType == 0) {
						this.selectedRowKeys = []
					}
					this.batchTypeValue = false
					this.batchTypeChange()
				} else {
					this.setBox()
				}
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
			// 文本表格隔行换色
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},

			// 左侧切换小组回调
			changeGroupId (id, isMoveType) {
				this.isMoveType = isMoveType
				if (isMoveType) {
					this.material_type = '1'
				}
				this.groupId = id
				this.resetBatch()
				this.name = ''
				this.materialList = []
				if (this.material_type != 0) {
					let params = this.getPageAndPageSize3()
					this.getMaterial(params.page, params.pageSize)
				} else {
					this.allPage = 1
					this.allPageSize = 15
					this.getAllMaterial(this.allPage, this.allPageSize)
				}

			},
			// 重置批量选择
			resetBatch () {
				this.batchTypeValue = false
				this.batchType = '1'
				this.selectedRowKeys = []
				this.checkBoxValue = []
				this.batchFlag = 0
			},
			//添加到企微侧边栏
			showSiderbar () {
				this.sidebarVisible = true
			},
			//添加到企微侧边栏——上传文件
			handleSidebarCancel () {
				if (!this.fileInfo.uid) {
					this.$message.warning('请选择文件！')
					return false
				}
				this.upLoadInfo(this.fileInfo);
			},
			selfUpLoadInfo ({action, file, onSuccess, onError, onProgress}) {
				const base64 = new Promise(resolve => {
					const fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					this.fileName = file.name;
					fileReader.onload = () => {
						resolve(fileReader.result);

					};
				});
				this.fileInfo = file;
			},
			beforeUpLoadInfo (file) {
				const isTxt = file.type === 'text/plain';
				if (!isTxt) {
					this.$message.error('只能上传txt文件');
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 <= 1;
				if (!isLt2M) {
					this.$message.error("文件不超过1M！");
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				return isLt2M;
			},
			async upLoadInfo () {
				let params = {}
				params = new FormData();
				params.append("uid", localStorage.getItem('uid'));
				params.append("fileInfo", this.fileInfo);
				const {data: res} = await this.axios.post("attachment/upload-txt", params, {cancelToken: source.token});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					this.$message.success('上传文件成功')
				}
			},
			//添加到企微侧边栏——查看使用教程
			handleSidebarOk () {
				window.open(
					'https://support.qq.com/products/104790/faqs/59786',
					"_blank"
				);
			},

			// 添加图文按钮
			addSketchList () {
				this.sketchList = [
					{
						inputTitle        : '',//标题
						digest            : '',//图文描述
						content_source_url: '',//跳转链接
						material_id       : '',
						local_path        : {
							img: require('../../../assets/img.png'),
						},
						closeShowModal3   : false,//每个图文消息是否选好素材
					}
				]
				this.selectGroupId = ''
				if (this.groupId.length != 0) {
					this.selectGroupId = this.groupId[0]
				}
				this.getGroupList()
				this.visibleSketchList = true
			},
			// 跳转图文添加页
			addFilingCabinetSketch () {
				this.$router.push("add?t=" + this.material_type + "&g=" + (this.groupId[0] || ''))
			},
			editFilingCabinetSketch (index, type) {
				if (type == 1) {
					this.allFileType = 4
					this.selectGroupId = this.allMaterialList[index].group_id
					let material = this.allMaterialList[index]
					if (material.is_editor == 0) {
						this.attachmentId = material.id
						this.sketchList = [
							{
								inputTitle        : material.artList[0].title,//标题
								digest            : material.artList[0].digest,//图文描述
								content_source_url: material.artList[0].jump_url,//跳转链接
								material_id       : material.artList[0].attach_id || 0,
								local_path        : {
									img: material.artList[0].local_path,
								},
								closeShowModal3   : true,//每个图文消息是否选好素材
							}
						]
						this.selectGroupId = this.allMaterialList[index].group_id
						this.getGroupList()
						this.visibleSketchList = true
					} else {
						this.$router.push("add?id=" + material.id + "&t=" + this.material_type + "&g=" + (this.allMaterialList[index].group_id || ''))
					}
				} else {
					this.selectGroupId = this.materialList[index].group_id
					let material = this.materialList[index]
					if (material.is_editor == 0) {
						this.attachmentId = material.id
						this.sketchList = [
							{
								inputTitle        : material.artList[0].title,//标题
								digest            : material.artList[0].digest,//图文描述
								content_source_url: material.artList[0].jump_url,//跳转链接
								material_id       : material.artList[0].attach_id || 0,
								local_path        : {
									img: material.artList[0].local_path,
								},
								closeShowModal3   : true,//每个图文消息是否选好素材
							}
						]
						this.selectGroupId = this.materialList[index].group_id
						this.getGroupList()
						this.visibleSketchList = true
					} else {
						this.$router.push("add?id=" + material.id + "&t=" + this.material_type + "&g=" + (this.materialList[index].group_id || ''))
					}
				}
			},
			statistic (index, type) {
				this.$router.push("info?id=" + index + "&type=" + type)
			},
			// 添加多图文；目前只支持单图文
			addSketch () {
				if (this.sketchList.length >= 8) {
					this.$message.error('最多添加8条图文')
				} else {
					this.sketchList.push({
						inputTitle        : '',
						digest            : '',
						content_source_url: '',
						material_id       : '',
						local_path        : {
							img  : require('../../../assets/img.png'),
							audio: ""
						},
						closeShowModal3   : false,
					})
				}
			},

			// 添加图文重置按钮
			deleteSketch (sketchIndex) {
				if (this.sketchList.length > 1) {
					this.sketchList.splice(sketchIndex, 1)
				} else {
					this.sketchList = [
						{
							inputTitle        : '',//标题
							digest            : '',//图文描述
							content_source_url: '',//跳转链接
							material_id       : '',
							local_path        : {
								img  : require('../../../assets/img.png'),
								audio: ""
							},
							closeShowModal3   : false,//每个图文消息是否选好素材
						}
					]
				}
			},

			// 添加图文提交
			handleAddSketchList () {
				let msg = {
					title    : '',//标题
					content  : '',//图文描述
					attach_id: '', // 图片id
					pic_url  : '',//跳转链接
					jump_url : '',
				}
				let item = this.sketchList[0]
				if (item.inputTitle == "" || item.local_path.img == '') {
					this.$message.warning("请检查图文内容是否填写完整！")
					return false
				}
				let reg = /^([hH][tT]{2}[pP]:|[hH][tT]{2}[pP][sS]:)((\\|\/)+)/;
				if (!reg.test(item.content_source_url)) {
					this.$message.warning('请检查跳转链接格式是否正确(https://或http://开头)！')
					return false
				}
				msg.title = item.inputTitle
				msg.content = item.digest
				msg.attach_id = item.material_id
				msg.pic_url = item.local_path.img
				msg.jump_url = item.content_source_url
				this.uploadMaterial(msg)
			},
			// 预览
			previewSketch (index, type) {
				let material = {}
				let url = this.$store.state.h5Url + '/preview'
				if (type == 1) {
					material = this.allMaterialList[index]
				} else {
					material = this.materialList[index]
				}
				if (material.artList[0].article_id) {
					url += '?article_id=' + material.artList[0].article_id
				} else if (material.id) {
					url += '?attach_id=' + material.id
				}
				this.qrcodeVisible = true
				this.$nextTick(() => {
					this.qrcode(url)
				})
			},
			// 二维码
			qrcode (url) {
				let qrcode = new QRCode('qrcode', {
					width     : 140,
					height    : 140,
					text      : url, // 二维码地址
					colorDark : "#000",
					colorLight: "#FFF",
				})
			},
			handleQrCode () {
				this.$refs.qrcode.innerHTML = ''
				this.qrcodeVisible = false
			},
			handleCancelQrCode () {
				this.$refs.qrcode.innerHTML = ''
				this.qrcodeVisible = false
			},
			// 上传素材
			async uploadMaterial (materialData) {
				let file_type = this.material_type
				if (this.material_type == 0) {
					file_type = this.allFileType
				}
				this.loading4 = true
				let params = {
					uid            : localStorage.getItem('uid'),
					sub_id         : localStorage.getItem('sub_id'),
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					file_type      : file_type,
					group_id       : this.selectGroupId,
				}
				if (this.material_type == 4 || this.allFileType == 4) {
					params['attachment_id'] = this.attachmentId
					params['msgData'] = materialData
				} else if (this.material_type == 1 || this.allFileType == 1) {
					params = new FormData();
					params.append("uid", localStorage.getItem('uid'));
					params.append("sub_id", localStorage.getItem('sub_id'));
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("group_id", this.selectGroupId);
					params.append("file_type", this.material_type);
					for(let i = 0; i < materialData.length; i++) {
						params.append("fileInfo"+i, materialData[i].originFileObj);
					}
				} else if (this.material_type == 2 || this.allFileType == 2) {
					params = new FormData();
					params.append("uid", localStorage.getItem('uid'));
					params.append("sub_id", localStorage.getItem('sub_id'));
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("group_id", this.selectGroupId);
					params.append("file_type", this.material_type);
					for(let i = 0; i < materialData.length; i++) {
						params.append("fileInfo"+i, materialData[i].originFileObj);
					}
				} else if (this.material_type == 3 || this.allFileType == 3) {
					params = new FormData();
					params.append("uid", localStorage.getItem('uid'));
					params.append("sub_id", localStorage.getItem('sub_id'));
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("group_id", this.selectGroupId);
					params.append("file_type", this.material_type);
					for(let i = 0; i < materialData.length; i++) {
						params.append("fileInfo"+i, materialData[i].originFileObj);
					}
				} else if (this.material_type == 5 || this.allFileType == 5) {
					params = new FormData();
					params.append("uid", localStorage.getItem('uid'));
					params.append("sub_id", localStorage.getItem('sub_id'));
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("group_id", this.selectGroupId);
					params.append("file_type", this.material_type);
					for(let i = 0; i < materialData.length; i++) {
						params.append("fileInfo"+i, materialData[i].originFileObj);
					}
				} else if (this.material_type == 6 || this.allFileType == 6) {
					params['content'] = materialData
					params['text_title'] = this.text_title
					params['attachment_id'] = this.attachmentId
				} else if (this.material_type == 7 || this.allFileType == 7) {
					params['appData'] = materialData
					params['attachment_id'] = this.attachmentId
				}
				const {data: res} = await this.axios.post("attachment/add", params, {cancelToken: source.token})
				if (res.error == 0) {
					this.visibleSketchList = false
					this.visible2 = false
					this.voiceVisible = false
					this.videoVisible = false
					this.miniprogramVisible = false
					this.fileVisible = false
					this.textVisible = false
					this.loading4 = false
					this.attachmentId = ""
					this.materialList = []

					this.resetBatch()
					if (this.material_type == 0) {
						this.getAllMaterial(this.allPage, this.allPageSize)
					} else {
						let pageParam = this.getPageAndPageSize1()
						this.getMaterial(pageParam.page, pageParam.pageSize)
					}
					this.$refs.filemenu.getGroupList()
				} else {
					this.$message.error(res.error_msg)
					this.loading4 = false
				}
			},

			// 取消提交图文
			handleCancelSketchList () {
				if (this.loading4) {
					source.cancel()
				}
				this.attachmentId = ''
				this.visibleSketchList = false
			},
			//打开上传页面
			openShowModal (sketchIndex, id) {
				if (typeof id == 'undefined') {
					this.chooseId = 0
				} else {
					this.chooseId = Number(id)
				}
				if (sketchIndex == -1) {
					this.comefrom = '3'
				} else {
					this.comefrom = ''
				}
				this.currentSketch = sketchIndex
				this.miniprogramVisible = false
				this.visibleSketchList = false
				this.showModal3 = true
			}
			,

			// 选择图片弹窗回调
			modalVisibleChange2 (event, e, id, url, fileName) {
				let that = this
				if (event == "ok") {
					if (isNaN(id) || id == '') {
						this.$message.error('请选择素材')
						this.showModal3 = false
					} else {

						if (this.currentSketch == -1) {
							that.showModal3 = false
							that.miniprogramVisible = false
							// that.miniprogram1.material_id = id
							this.$refs.cropper.edit(url, fileName)
							// that.miniprogram1.local_path.img = url
						} else {
							this.showModal3 = false
							this.visibleSketchList = true
							this.sketchList[this.currentSketch].material_id = id
							this.sketchList[this.currentSketch].local_path.img = url
							this.sketchList[this.currentSketch].closeShowModal3 = true
						}
					}
				} else {
					this.showModal3 = false
					if (this.currentSketch == -1) {
						this.miniprogramVisible = true
					} else {
						this.visibleSketchList = true
					}
				}
			},
			cancleAppletPic () {
				this.miniprogramVisible = true
			},
			uploadAppletPic (id, url) {
				this.miniprogram1.material_id = id
				this.miniprogram1.local_path.img = url
			},
			//图文、图片、音频等tab栏切换
			callback (key) {
				if (this.material_type == key) {
					return false
				}
				if (key == 4) {
					this.sketchType = this.showType
				}
				if (this.material_type == 4) {
					this.showType = this.sketchType
				}
				this.allFileType = 0
				this.resetBatch()
				this.material_type = key;
				this.name = ''
				this.isLoading = true;
				this.materialList = []
				this.clickIndex = -1
				clearInterval(this.t1)
				if (this.material_type != 0) {
					// let params = this.getPageAndPageSize1()
					this.getMaterial(1, 15);
				} else {
					this.allPage = 1
					this.allPageSize = 15
					this.getAllMaterial(this.allPage, this.allPageSize);
				}

			},
			// 允许文本表格tr拖拽
			// trAddDraggableAndId () {
			// 	let that = this
			// 	let tr = document.getElementsByClassName('ant-table-row')
			// 	// let tr = table.getElementsByTagName('tr')
			// 	for (let i = 0; i < tr.length; i++) {
			// 		tr[i].draggable = true
			// 		tr[i].id = that.materialList7[i].id
			// 		tr[i].attachEvent("ondragstart", function(e) {
			// 			that.drag(e)
			// 		})
			// 	}
			// },

			// 搜索按钮
			onSearch (value) {
				if (this.clickIndex != -1) {
					this.$refs.audio[this.clickIndex].pause();
					clearInterval(this.t1)
					this.clickIndex = -1
				}
				this.name = value;
				this.materialList = []
				// this.resetBatch()
				if (this.material_type == 0) {
					this.getAllMaterial(1, this.allPageSize)
				} else {
					let params = this.getPageAndPageSize()
					this.getMaterial(params.page, params.pageSize);
				}
			},
			// 清空按钮
			clearInput () {
				if (this.clickIndex != -1) {
					this.$refs.audio[this.clickIndex].pause();
					clearInterval(this.t1)
					this.clickIndex = -1
				}
				this.name = "";
				this.materialList = []
				if (this.material_type == 0) {
					this.getAllMaterial(1, this.allPageSize)
				} else {
					let params = this.getPageAndPageSize1()
					this.getMaterial(params.page, params.pageSize);
				}
				this.resetBatch()
			},

			// 图文手机预览，暂不支持
			phoneView (id) {
				this.materialId = id;
				this.visible = true;
			},
			// 发送预览，暂不支持
			handleOk (e) {
				this.loading3 = true;
				this.phonePreview();
			},
			// 发送预览取消
			handleCancel (e) {
				this.visible = false;
				this.inputUsername = ''
			},
			async phonePreview () {
				if (this.inputUsername == '') {
					this.$message.error('请输入接收预览的微信号（需关注）');
					this.loading3 = false;
					return false;
				}
				const {data: res} = await this.axios.post("material/preview", {
					username   : this.inputUsername,
					material_id: this.materialId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.inputUsername = "";
					this.loading3 = false;
				} else {
					this.$message.success("预览消息发送成功");
					this.loading3 = false;
					this.inputUsername = "";
					this.visible = false;
				}
			},
			//删除单图文
			delPicTxt (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该素材?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.isLoading = true;
						that.delView(id);
					}
				});
			},
			//删除素材
			async delView (id) {
				const {data: res} = await this.axios.post("attachment/delete", {
					uid          : localStorage.getItem('uid'),
					attachment_id: id
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.resetDelete()
				}
			},
			// async delMaterial () {
			// 	const {data: res} = await this.axios.post("attachment/delete", {
			// 		uid          : localStorage.getItem('uid'),
			// 		attachment_id: this.selectedRowKeys
			// 	});
			// 	if (res.error != 0) {
			// 		this.isLoading = false;
			// 		this.$message.error(res.error_msg);
			// 	} else {
			// 		this.resetDelete()
			// 	}
			// },
			// 批量删除后重置
			resetDelete () {
				this.$message.success("删除成功");
				this.isLoading = false;
				this.materialList = []
				this.resetBatch()
				if (this.material_type != 0) {
					let params = this.getPageAndPageSize2()
					this.getMaterial(params.page, params.pageSize);
				} else {
					if(this.allMaterialList.length == 1 && this.allPage > 1) {
						this.allPage -= 1
					}
					this.getAllMaterial(this.allPage, this.allPageSize)
				}
				// this.$refs.filemenu.getGroupList()
				this.selectedRowKeys = []
			},
			// 切换分组重置page和pageSize
			getPageAndPageSize3 () {
				let params = {
					page    : 1,
					pageSize: 15
				}
				if (this.material_type == 4) {
					if (this.sketchType == 0) {
						params = {
							page    : 1,
							pageSize: 16
						}
					}
				}
				this.page = 1
				this.pageSize = 15
				this.page2 = 1
				this.pageSize2 = 16
				this.page3 = 1
				this.pageSize3 = 15
				this.page4 = 1
				this.pageSize4 = 15
				this.page5 = 1
				this.pageSize5 = 15
				this.page6 = 1
				this.pageSize6 = 15
				this.page7 = 1
				this.pageSize7 = 15
				return params
			},
			// 不同类型 page和pageSize
			getPageAndPageSize1 () {
				let params = {}
				if (this.material_type == 1) {
					params.page = this.page
					params.pageSize = this.pageSize
				} else if (this.material_type == 2) {
					params.page = this.page3
					params.pageSize = this.pageSize3
				} else if (this.material_type == 3) {
					params.page = this.page4
					params.pageSize = this.pageSize4
				} else if (this.material_type == 4) {
					this.page2 = 1
					this.sketchPage = 1
					if (this.sketchType == 0) {
						params.page = this.page2
						params.pageSize = this.pageSize2
					} else {
						params.page = this.sketchPage
						params.pageSize = this.sketchPageSize
					}
				} else if (this.material_type == 7) {
					params.page = this.page5
					params.pageSize = this.pageSize5
				} else if (this.material_type == 5) {
					params.page = this.page6
					params.pageSize = this.pageSize6
				} else if (this.material_type == 6) {
					params.page = this.page7
					params.pageSize = this.pageSize7
				}
				return params
			},
			getPageAndPageSize2 () {
				let params = {}
				if (this.material_type == 1) {
					if(this.materialList2.length == 1 && this.page > 1) {
						this.page -= 1
					}
					params.page = this.page
					params.pageSize = this.pageSize
				} else if (this.material_type == 2) {
					if(this.materialList3.length == 1 && this.page3 > 1) {
						this.page3 -= 1
					}
					params.page = this.page3
					params.pageSize = this.pageSize3
				} else if (this.material_type == 3) {
					if(this.materialList4.length == 1 && this.page4 > 1) {
						this.page4 -= 1
					}
					params.page = this.page4
					params.pageSize = this.pageSize4
				} else if (this.material_type == 4) {
					if(this.materialList.length == 1 && this.page2 > 1) {
						this.page2 -= 1
						this.sketchPage -= 1
					}
					if (this.sketchType == 0) {
						params.page = this.page2
						params.pageSize = this.pageSize2
					} else {
						params.page = this.sketchPage
						params.pageSize = this.sketchPageSize
					}
				} else if (this.material_type == 7) {
					if(this.materialList5.length == 1 && this.page5 > 1) {
						this.page5 -= 1
					}
					params.page = this.page5
					params.pageSize = this.pageSize5
				} else if (this.material_type == 5) {
					if(this.materialList6.length == 1 && this.page6 > 1) {
						this.page6 -= 1
					}
					params.page = this.page6
					params.pageSize = this.pageSize6
				} else if (this.material_type == 6) {
					if(this.materialList7.length == 1 && this.page7 > 1) {
						this.page7 -= 1
					}
					params.page = this.page7
					params.pageSize = this.pageSize7
				}
				return params
			},
			// 不同类型重置page和pageSize
			getPageAndPageSize () {
				let params = {}
				if (this.material_type == 1) {
					this.page = 1
					this.pageSize = 15
					params.page = this.page
					params.pageSize = this.pageSize
				} else if (this.material_type == 2) {
					this.page3 = 1
					this.pageSize3 = 15
					params.page = this.page3
					params.pageSize = this.pageSize3
				} else if (this.material_type == 3) {
					this.page4 = 1
					this.pageSize4 = 15
					params.page = this.page4
					params.pageSize = this.pageSize4
				} else if (this.material_type == 4) {
					this.page2 = 1
					this.pageSize2 = 16
					this.sketchPage = 1
					this.sketchPageSize = 15
					if (this.sketchType == 0) {
						params.page = this.page2
						params.pageSize = this.pageSize2
					} else {
						params.page = this.sketchPage
						params.pageSize = this.sketchPageSize
					}
				} else if (this.material_type == 7) {
					this.page5 = 1
					this.pageSize5 = 15
					params.page = this.page5
					params.pageSize = this.pageSize5
				} else if (this.material_type == 5) {
					this.page6 = 1
					this.pageSize6 = 15
					params.page = this.page6
					params.pageSize = this.pageSize6
				} else if (this.material_type == 6) {
					this.page7 = 1
					this.pageSize7 = 15
					params.page = this.page7
					params.pageSize = this.pageSize7
				}
				return params
			},
			//获取素材列表
			async getMaterial (page, pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("attachment/list", {
					uid      : localStorage.getItem('uid'),
					file_type: this.material_type,
					group_id : this.groupId.length > 0 ? this.groupId : "",
					name     : this.name,
					page     : page,
					pageSize : pageSize,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.materialKeys = res.data.keys
					if (this.material_type == 4) {
						this.materialListTotal = parseInt(res.data.count)
						// this.lastTime = res.data.pull_time;
						this.single = res.data.attachment.single;
						this.double = res.data.attachment.double;
						if (this.sketchType == 0) {
							this.page2 = page
							if(page == 1) {
								this.materialList = [...res.data.attachment.single.list, ...res.data.attachment.double.list]
							} else {
								this.materialList = this.materialList.concat([...res.data.attachment.single.list, ...res.data.attachment.double.list])
							}
							this.setCheckedBox(this.materialList)
						} else if (this.sketchType == 1) {
							this.sketchPage = page
							this.sketchPageSize = pageSize
							this.materialList = [...res.data.attachment.single.list, ...res.data.attachment.double.list]
							this.setCheckedBox(this.materialList)
						}
					} else if (this.material_type == 1) {
						this.lastTime = res.data.pull_time;
						this.materialList2 = res.data.attachment;
						this.setCheckedBox(this.materialList2)
						this.total = parseInt(res.data.count);
						this.quickJumper = this.total > this.pageSize;
						this.page = page
						this.pageSize = pageSize
					} else if (this.material_type == 2) {
						this.materialList3 = res.data.attachment;
						this.setCheckedBox(this.materialList3)
						this.lastTime = res.data.pull_time;
						this.total3 = parseInt(res.data.count);
						this.quickJumper3 = this.total3 > this.pageSize;
						this.page3 = page
						this.pageSize3 = pageSize
					} else if (this.material_type == 3) {
						this.total4 = parseInt(res.data.count);
						this.materialList4 = res.data.attachment;
						this.setCheckedBox(this.materialList4)
						if (this.total4 != 0) {
							this.lastTime = res.data.pull_time;
							this.materialList4.map((data, index) => {
								this.playerOptions[index] = {
									...this.publicOptions,
									sources: [
										{
											src : this.commonUrl + data.local_path, // 路径
											type: "video/mp4" // 类型
										}
									]
								};
							});
							this.page4 = page
							this.pageSize4 = pageSize
							this.quickJumper4 = this.total4 > this.pageSize;
						}
					} else if (this.material_type == 7) {
						this.total5 = parseInt(res.data.count);
						this.materialList5 = res.data.attachment;
						this.setCheckedBox(this.materialList5)
						this.quickJumper5 = this.total5 > this.pageSize;
						this.page5 = page
						this.pageSize5 = pageSize
					} else if (this.material_type == 5) {
						this.total6 = parseInt(res.data.count);
						this.materialList6 = res.data.attachment;
						this.setCheckedBox(this.materialList6)
						this.quickJumper6 = this.total6 > this.pageSize;
						this.page6 = page
						this.pageSize6 = pageSize
					} else if (this.material_type == 6) {
						this.total7 = parseInt(res.data.count);
						this.quickJumper7 = this.total7 > this.pageSize;
						this.materialList7 = res.data.attachment;

						this.page7 = page
						this.pageSize7 = pageSize
						this.setCheckedBox(this.materialList7)
						// if (this.total7 != 0) {
						// 	this.trAddDraggableAndId()
						// }
					}
					this.isLoading = false;
				}
			},
			async getAllMaterial (page, pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("attachment/search", {
					uid      : localStorage.getItem('uid'),
					group_id : this.groupId.length > 0 ? this.groupId : "",
					file_type: this.material_type,
					name     : this.name,
					page     : page,
					pageSize : pageSize,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.materialKeys = res.data.keys
					this.allTotal = parseInt(res.data.count)
					this.allPage = page
					this.allPageSize = pageSize
					this.allMaterialList = res.data.list
					this.setCheckedBox(this.allMaterialList)
					this.isLoading = false
					this.allMaterialList.map((data, index) => {
						if (data.file_type == 3) {
							this.playerOptions[index] = {
								...this.publicOptions,
								sources: [
									{
										src : this.commonUrl + data.local_path, // 路径
										type: "video/mp4" // 类型
									}
								]
							};
						}
					});
				}
			},
			changeAllPage (page, pageSize) {
				this.getAllMaterial(page, this.allPageSize)
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,220)
				})
			},
			showAllSizeChange (page, pageSize) {
				this.getAllMaterial(this.allPage, pageSize)
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
					if (this.selectedRowKeys.length == this.materialKeys.length) {
						this.batchTypeValue = true
					} else {
						this.batchTypeValue = false
					}
				}


			},
			//图片按钮
			previewPic (index) {
				let list = localStorage.getItem('permissionButton').split(",")
				if (list.length == 1 && list[0] === "all") {
					this.previewVisible = true;
					this.$nextTick(() => {
						// 默认显示当前选中的资源
						this.$refs.previewCarousel.goTo(index, false);
					});
				} else {
					if (list.indexOf('material-preview') != -1) {
						//存在
						this.previewVisible = true;
						this.$nextTick(() => {
							// 默认显示当前选中的资源
							this.$refs.previewCarousel.goTo(index, false);
						});
					} else {
						return false
					}
				}
			},
			previewPic1 (index) {
				let list = localStorage.getItem('permissionButton').split(",")
				if (list.length == 1 && list[0] === "all") {
					this.material = this.allMaterialList[index]
					this.previewAllVisible = true;
				} else {
					if (list.indexOf('material-preview') != -1) {
						//存在
						this.material = this.allMaterialList[index]
						this.previewAllVisible = true;
					} else {
						return false
					}
				}
			},
			handleCancel3 () {
				this.previewAllVisible = false
			},
			// 预览图片的弹窗隐藏
			handleCancel2 () {
				this.previewVisible = false;
			},
			// 删除图片
			delPic (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该图片?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delView(id);
					}
				});
			},
			//下载
			download (href, name) {
				let eleLink = document.createElement('a')
				eleLink.download = name
				eleLink.href = href
				eleLink.click()
				eleLink.remove()
			},
			downLoadWay (title, url) {
				let that = this
				let image = new Image()
				image.setAttribute('crossOrigin', 'anonymous')
				image.src = this.commonUrl + url
				image.onload = () => {
					let canvas = document.createElement('canvas')
					canvas.width = image.width
					canvas.height = image.height
					let ctx = canvas.getContext('2d')
					ctx.drawImage(image, 0, 0, image.width, image.height)
					canvas.toBlob((blob) => {
						let url = URL.createObjectURL(blob)
						that.download(url, title)
						// 用完释放URL对象
						URL.revokeObjectURL(url)
					})
				}
			},
			//上传图片
			showModal () {
				this.selectGroupId = ''
				if (this.groupId.length != 0) {
					this.selectGroupId = this.groupId[0]
				}
				this.getGroupList()
				this.imageUrl = ''
				this.fileInfo = {}
				this.fileList = []
				this.visible2 = true;
			},
			uploadPic () {
				this.loading4 = true;
				if (this.fileList.length == 0) {
					this.$message.warning('请选择图片！')
					this.loading4 = false
					return false
				}
				this.uploadMaterial(this.fileList);
			},
			cancelUploadPic () {
				if (this.loading4) {
					source.cancel()
				}
				this.visible2 = false;
				this.defaultValue = 1;
				this.imageUrl = "";
			},
			handleChangePic(info) {
				let file = info.file
				if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg') {
					this.$message.error("图片类型仅支持png、jpg、jpeg类型！");
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 <= 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				let fileList = [...info.fileList]
				this.fileList = fileList
			},
			deleteFileList(index) {
				this.fileList.splice(index, 1)
			},
			// 图片分页
			changePage (page, pageSize) {
				this.getMaterial(page, pageSize);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,220)
				})
			},
			showSizeChange (page, pageSize) {
				this.getMaterial(1, pageSize);
			},
			// 上传音频
			showModalVoice () {
				if (this.clickIndex != -1) {
					this.$refs.audio[this.clickIndex].pause();
					clearInterval(this.t1)
					this.clickIndex = -1
				}
				this.selectGroupId = ''
				if (this.groupId.length != 0) {
					this.selectGroupId = this.groupId[0]
				}
				this.getGroupList()
				this.voiceTitle = ''
				this.voiceName = ''
				this.voiceUrl = ''
				this.playVoiceTime = ''
				this.playVoice = false
				this.fileList = []
				this.fileInfo = {}
				this.voiceVisible = true
			},
			uploadVoice () {
				this.loading4 = true;
				if (this.fileList.length == 0) {
					this.$message.warning('请选择音频！')
					this.loading4 = false
					return false
				}
				this.uploadMaterial(this.fileList);
			},
			cancelUploadVoice () {
				if (this.loading4) {
					source.cancel()
				}
				clearInterval(this.t2);
				this.voiceVisible = false;
				this.voiceUrl = ""
				this.playVoiceTime = ""
				this.playVoice = false
				this.voiceName = "";
			},
			handleChangeVoice(info) {
				let file = info.file
				if (file.type != 'audio/mp3' && file.type != 'audio/amr' && file.type != 'audio/mpeg') {
					this.$message.error("音频类型仅支持AMR、MP3类型！");
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 <= 2;
				if (!isLt2M) {
					this.$message.error("音频不超过2M！");
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				let fileList = [...info.fileList]
				this.fileList = fileList
			},
			//音频分页
			changePage3 (page3, pageSize3) {
				clearInterval(this.t1)
				this.clickIndex = -1
				this.getMaterial(page3, pageSize3);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,220)
				})
			},
			showSizeChange3 (page3, pageSize3) {
				this.getMaterial(1, pageSize3);
			},

			//上传视频
			showModalVideo () {
				this.selectGroupId = ''
				if (this.groupId.length != 0) {
					this.selectGroupId = this.groupId[0]
				}
				this.getGroupList()
				this.videoTitle = ''
				this.fileInfo = {}
				this.fileList = []
				this.videoUrl = ''
				this.playerVideoOptions = {}
				this.videoVisible = true
			},
			uploadVideo () {
				this.loading4 = true;
				if (this.fileList.length == 0) {
					this.$message.warning('请选择视频！')
					this.loading4 = false
					return false
				}
				this.uploadMaterial(this.fileList);
			},
			cancelUploadVideo () {
				if (this.loading4) {
					source.cancel()
				}
				this.videoVisible = false
			},
			handleChangeVedio(info) {
				let file = info.file
				if (file.type != 'video/mp4') {
					this.$message.error("视频类型仅支持mp4类型！");
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 <= 10;
				if (!isLt2M) {
					this.$message.error("视频不超过10M！");
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				let fileList = [...info.fileList]
				this.fileList = fileList
			},
			selfUploadVideo ({action, file, onSuccess, onError, onProgress}) {
				let that = this
				const base64 = new Promise(resolve => {
					const fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					this.videoName = file.name
					fileReader.onload = () => {
						that.videoUrl = fileReader.result
						that.playerVideoOptions = {
							...that.publicOptions,
							sources: [
								{
									src : fileReader.result, // 路径
									type: "video/mp4" // 类型
								}
							]
						};
						resolve(fileReader.result);
					};
				});
				this.fileInfo = file;
			},
			beforeUploadVideo (file) {
				if (file.type != 'video/mp4') {
					this.$message.error("视频类型仅支持mp4类型！");
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 <= 10;
				if (!isLt2M) {
					this.$message.error("视频不超过10M！");
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				return isLt2M;
			},
			// 视频分页
			changePage4 (page4, pageSize4) {
				this.getMaterial(page4, pageSize4);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,220)
				})
			},
			showSizeChange4 (page4, pageSize4) {
				this.getMaterial(1, pageSize4);
			},
			//删除视频
			delVideo (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该视频?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delView(id);
					}
				});
			},
			// 上传音频音频
			delAudio (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该音频?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delView(id);
					}
				});
			},
			// 列表播放音频
			playMusic (index, flag) {
				clearInterval(this.t1);
				if (this.clickIndex != -1) {
					this.$refs.audio[this.clickIndex].pause();
				}
				if (!flag) {
					this.clickIndex = -1
					this.flag = !this.flag
					return
				}
				this.$refs.audio[index].play();
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
							Math.ceil(this.$refs.audio[index].duration)
						);
					}
				}, 1000);
			},
			playMusicByAll (index, flag) {
				clearInterval(this.t1);
				if (this.clickIndex != -1) {
					document.getElementsByName(index)[0].pause();
				}
				if (!flag) {
					this.clickIndex = -1
					this.flag = !this.flag
					return
				}
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
			// 计算音频时长
			oncanplay (res) {
				const audioIndex = res.target.dataset.index;
				this.$set(this.playTime, audioIndex, Math.ceil(res.target.duration));
			},
			// 上传音频播放
			playMusic1 () {
				let that = this
				if (this.playVoice) {
					this.$refs.audio1.pause()
					that.playVoice = false
					clearInterval(this.t2)
					return
				}
				this.$refs.audio1.play();
				this.playVoice = true
				this.t2 = setInterval(() => {
					that.playVoiceTime--;
					if (that.playVoiceTime <= 0) {
						that.playVoice = false
						clearInterval(this.t2);
						that.playVoiceTime = Math.ceil(this.$refs.audio1.duration)
					}
				}, 1000);
			},
			// 上传音频时长
			oncanplay1 (res) {
				this.playVoiceTime = Math.ceil(res.target.duration)
			},
			scroll (scrollData) {
			},
			loadMore (e) {
				console.log(e)
			},
			finish () {
			},
			//小程序弹窗
			showModalMiniprogram () {
				this.appletTitle = '新建小程序素材'
				this.appletDisabled = false
				this.selectGroupId = ''
				if (this.groupId.length != 0) {
					this.selectGroupId = this.groupId[0]
				}
				this.getGroupList()
				this.miniprogram1 = {
					appId      : '',
					linkUrl    : '',
					title      : '',
					material_id: '',
					local_path : {
						img  : "",
						audio: ''
					}
				}
				this.miniprogramVisible = true
			},
			cancelUploadMiniprogram () {
				this.attachmentId = ''
				this.miniprogramVisible = false
			},
			checkout (title) {
				if (title.length < 4) {
					this.$message.warning('小程序标题长度需在4-12个字符')
				}
			},
			uploadMiniprogram () {
				if (!this.miniprogram1.appId) {
					this.$message.warning('请填写小程序appId！')
					return false
				}
				if (!this.miniprogram1.linkUrl) {
					this.$message.warning('请填写小程序路径！')
					return false
				}
				if (!this.miniprogram1.title) {
					this.$message.warning('请填写卡片标题！')
					return false
				}
				if (this.miniprogram1.title.length < 4) {
					this.$message.error('小程序标题长度需在4-12个字符')
					return false;
				}
				if (this.miniprogram1.local_path.img == '') {
					this.$message.warning('请选择卡片图片！')
					return false
				}
				let data = {
					appId    : this.miniprogram1.appId,
					appPath  : this.miniprogram1.linkUrl,
					title    : this.miniprogram1.title,
					pic_url  : this.miniprogram1.local_path.img,
					attach_id: this.miniprogram1.material_id
				}
				this.uploadMaterial(data)
			},
			// 编辑小程序
			editApplet (index, type) {
				this.appletTitle = '编辑小程序素材'
				if (type == 1) {
					this.allFileType = 7
					this.attachmentId = this.allMaterialList[index].id
					this.miniprogram1.appId = this.allMaterialList[index].appId
					this.miniprogram1.linkUrl = this.allMaterialList[index].appPath
					this.miniprogram1.title = this.allMaterialList[index].file_name
					this.miniprogram1.material_id = this.allMaterialList[index].attach_id
					this.miniprogram1.local_path.img = this.allMaterialList[index].local_path
					this.selectGroupId = this.allMaterialList[index].group_id
				} else {
					this.attachmentId = this.materialList5[index].id
					this.miniprogram1.appId = this.materialList5[index].appId
					this.miniprogram1.linkUrl = this.materialList5[index].appPath
					this.miniprogram1.title = this.materialList5[index].file_name
					this.miniprogram1.material_id = this.materialList5[index].attach_id
					this.miniprogram1.local_path.img = this.materialList5[index].local_path
					this.selectGroupId = this.materialList5[index].group_id
				}

				this.getGroupList()
				this.appletDisabled = true
				this.miniprogramVisible = true
			},
			// 删除小程序
			delMiniprogram (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该小程序?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delView(id);
					}
				});
			},
			changePage5 (page5, pageSize5) {
				this.getMaterial(page5, pageSize5);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,220)
				})
			},
			showSizeChange5 (page5, pageSize5) {
				this.getMaterial(1, pageSize5);
			},

			// 文件
			showModalFile () {
				this.selectGroupId = ''
				if (this.groupId.length != 0) {
					this.selectGroupId = this.groupId[0]
				}
				this.getGroupList()
				this.fileInfo = {}
				this.fileList = []
				this.fileName = ''
				this.fileVisible = true
			},
			cancelUploadFile () {
				this.fileVisible = false
			},
			uploadFile () {
				this.loading4 = true;
				if (this.fileList.length == 0) {
					this.$message.warning('请选择文件！')
					this.loading4 = false
					return false
				}
				this.uploadMaterial(this.fileList);
			},
			handleChangeFile(info) {
				let file = info.file
				let fileType = file.type
				if (fileType.length == 0) {
					fileType = this.getFileType(file)
				}
				let fileTypeData = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'text/csv', 'application/pdf', 'application/octet-stream'];
				let flag = fileTypeData.includes(fileType)

				if (!flag) {
					this.$message.error("文件类型仅支持DOC、DOCX、XLS、XLSX、CSV、PPT、PPTX、TXT、PDF及Xmind类型！");
					return false;
				}
				const isLt2M = file.size / 1024 / 1024 <= 20;
				if (!isLt2M) {
					this.$message.error("文件不超过20M！");
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				let fileList = [...info.fileList]
				this.fileList = fileList
			},
			delFile (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该文件?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delView(id);
					}
				});
			},
			changePage6 (page6, pageSize6) {
				this.getMaterial(page6, pageSize6);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,220)
				})
			},
			showSizeChange6 (page6, pageSize6) {
				this.getMaterial(1, pageSize6);
			},
			// 文本
			showModalText () {
				this.selectGroupId = ''
				if (this.groupId.length != 0) {
					this.selectGroupId = this.groupId[0]
				}
				this.textTitle = "新建文本素材"
				this.getGroupList()
				this.wordNum = 0
				this.textValue = ''
				this.text_title = ''
				this.textVisible = true
			},
			// 导入文本
			importExcel() {
				this.fileName = ''
				this.fileInfo = {}
				this.textImportVisible = true
			},
			// 导入文本提交
			async handleOkText () {
				this.modalLoading = true
				if (JSON.stringify(this.fileInfo) == '{}') {
					this.$message.error('请选择上传Excel');
					this.modalLoading = false
					return false;
				}
				this.showModal = false
				this.$message.info("已进入后台导入中，请耐心等待...");
				this.progressNum = 0
				this.successNum = 0
				this.failNum = 0
				this.notImportNum = 0
				this.progressVisible = true
				this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
				this.$nextTick(() => {
					document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
				})
				let param = new FormData();
				param.append("importFile", this.fileInfo);
				param.append("uid", localStorage.getItem('uid'));
				param.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
				param.append("sub_id", localStorage.getItem('sub_id'));
				const {data: res} = await this.axios.post(
					"attachment/import-attachment", param
				);
				if (res.error != 0) {
					this.modalLoading = false;
					this.progressVisible = false
					this.$message.error(res.error_msg);
				} else {
					// this.$message.info("已进入后台导入中，请耐心等待...");
				}
			},
			// 取消导入文本
			handleCancelText () {
				this.selectGroupId = ''
				this.fileInfo = {}
				this.file_name = ''
				this.modalLoading = false;
				this.textImportVisible = false
			},
			// 导入文本上传文件
			beforeUploadText (file) {
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
				this.fileName = file.name;
				return false; // 返回false不会自动上传
			},
			//删除Excel
			closeExcel () {
				this.fileInfo = {}
				this.fileName = ''
			},
			//后台返回导入进度数据处理
			websocketOnMessage (data) {
				if (typeof data.type != 'undefined' && data.type == 'import_attachment') {
					this.progressVisible = true
					this.leftSiderWidth = document.getElementsByClassName('menu-sider')[0].style.width
					this.$nextTick(() => {
						document.getElementsByClassName('mask-dialog')[0].style.left = document.getElementsByClassName('menu-sider')[0].style.width
					})
					this.textImportVisible = false
					this.progressNum = parseInt(data.import_num / data.snum * 100)
					this.successNum = data.successNum
					this.failNum = data.failNum
					this.notImportNum = data.notImportNum

					if (data.textHtml != '') {
						if (data.error == 0) {
							this.modalLoading = false;
							this.textImportVisible = false
							this.$message.success(data.textHtml);
							this.getMaterial()
							this.$refs.filemenu.getGroupList()
						} else {
							this.$message.error(data.textHtml);
						}
					}

					if (this.progressNum == 100) {
						this.progressVisible = false
					}
				}
			},
			cancelUploadText () {
				this.attachmentId = ''
				this.textVisible = false
			},
			uploadText () {
				if (this.text_title == '') {
					this.$message.warning('请输入文本标题！')
					return false
				}
				if (!this.textContent) {
					this.$message.warning('请输入文本内容！')
					return false
				}
				this.uploadMaterial(this.textContent)
			},
			delText (id) {
				let that = this;
				that.$confirm({
					title     : "确定删除该文本?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delView(id);
					}
				});
			},
			editText (index, type) {
				this.textTitle = '编辑文本素材'
				if (type == 1) {
					this.allFileType = 6
					this.text_title = this.allMaterialList[index].file_name
					this.textContent = this.allMaterialList[index].content
					this.attachmentId = this.allMaterialList[index].id
					this.textValue = this.allMaterialList[index].content.replace(/\n/g, '<br>')
					let a = this.allMaterialList[index].content.replace(/\n/g, '').replace(/(<\/?a.*?>)/g, '')
					this.wordNum = a.length
					this.selectGroupId = this.allMaterialList[index].group_id
				} else {
					this.text_title = this.materialList7[index].file_name
					this.textContent = this.materialList7[index].content
					this.attachmentId = this.materialList7[index].id
					this.textValue = this.materialList7[index].content.replace(/\n/g, '<br>')
					let a = this.materialList7[index].content.replace(/\n/g, '').replace(/(<\/?a.*?>)/g, '')
					this.wordNum = a.length
					this.selectGroupId = this.materialList7[index].group_id
				}
				this.getGroupList()
				this.textVisible = true
			},
			changePage7 (page7, pageSize7) {
				this.getMaterial(page7, pageSize7);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,220)
				})
			},
			showSizeChange7 (page7, pageSize7) {
				this.getMaterial(1, pageSize7);
			},

			// 分组弹窗
			changeMaterial (id, groupId) {
				this.batchFlag = 0
				this.attachmentId = id

				this.group = groupId
				this.getGroupList()
				this.groupVisible = true
			},
			batchMove () {
				if (this.selectedRowKeys.length == 0) {
					return false
				}
				this.batchFlag = 1
				this.group = this.groupId[0]
				this.getGroupList()
				this.groupVisible = true
			},
			batchDelete () {
				if (this.selectedRowKeys.length == 0) {
					return false
				}
				let that = this;
				that.$confirm({
					title     : "确定删除选中素材?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.delView(that.selectedRowKeys);
					}
				});
			},
			batchUpload () {
				if (this.selectedRowKeys.length == 0) {
					return false
				}
				let that = this;
				that.$confirm({
					title     : "确定下载选中素材?",
					okText    : "确定",
					okType    : "primary",
					cancelText: "取消",
					onOk () {
						that.uploadQrcode(that.selectedRowKeys);
					}
				});
			},
			moment,
			async uploadQrcode () {
				const {data: res} = await this.axios.post("attachment/batch-down", {
					uid: localStorage.getItem("uid"),
					ids: this.selectedRowKeys
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
					this.resetBatch()
				}
			},
			// 图文列表分页
			changeSketchPage (page, pageSize) {
				this.getMaterial(page, this.sketchPageSize)
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0,220)
				})
			},
			showSketchSizeChange (page, pageSize) {
				this.getMaterial(this.sketchPage, pageSize)
			},
			// 切换图文展示方式
			changeSketchType (type) {
				if (this.sketchType == type) {
					return false
				}
				this.sketchType = type
				this.page2 = 1
				this.sketchPage = 1
				this.materialList = []

				if (this.sketchType == 0) {
					this.getMaterial(this.page2, this.pageSize2)
				} else {
					this.getMaterial(this.sketchPage, this.sketchPageSize)
				}
			},
			changeShowType (type) {
				if (this.showType == type) {
					return false
				}
				if (type == 0) {
					if (this.material_type == 1) {
						this.setCheckedBox(this.materialList2)
					} else if (this.material_type == 2) {
						this.setCheckedBox(this.materialList3)
					} else if (this.material_type == 3) {
						this.setCheckedBox(this.materialList4)
					} else if (this.material_type == 5) {
						this.setCheckedBox(this.materialList6)
					} else if (this.material_type == 7) {
						this.setCheckedBox(this.materialList5)
					}
				}
				if (type == 0) {
					if (this.selectedRowKeys.length == this.materialKeys.length) {
						this.batchType = '1'
						this.batchTypeValue = true
					} else {
						this.batchType = '1'
						this.batchTypeValue = false
					}
				}
				this.showType = type
			},
			async getGroupList () {
				let that = this
				let params = {
					uid: localStorage.getItem('uid')
				}
				if (!this.isMoveType && this.material_type != 1) {
					params['is_channel'] = 1
				}
				const {data: res} = await this.axios.post("attachment/group", params);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					if (!this.selectGroupId) {
						this.selectGroupId = this.groupList[0].key
					}
				}
			},
			// 移动分组
			handleChangeGroup () {
				this.groupLoading = true
				if (this.group == this.groupId) {
					this.groupLoading = false
					this.groupVisible = false
					return false
				}
				if (this.batchFlag == 0) {
					this.changeMaterial2Group({groupId: this.group, material_id: this.attachmentId})
				} else {
					this.batchMoveMaterial2Group({groupId: this.group, ids: this.selectedRowKeys})
				}
			},
			cancelChangeGroup () {
				this.attachmentId = ''
				this.groupVisible = false
			},
			// 分组弹窗切换分组
			changeGroup (id) {
				this.group = id
			},
			// 添加素材分组搜索过滤
			filterOption (input, option) {
				return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
			},
			// 添加素材分组名改变
			changeSelectGroupId (id) {
				this.selectGroupId = id
			},
			onselect (e) {
				if (e.length > 0) {
					this.group = e[0]
				}
			},
			//附件换组
			async changeMaterial2Group (data) {
				const {data: res} = await this.axios.post("attachment/group-change", {
					uid          : localStorage.getItem('uid'),
					group_id     : data.groupId,
					attachment_id: data.material_id
				});
				if (res.error != 0) {
					this.groupLoading = false
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.resetList()
				}
			},
			// 附件批量换组
			async batchMoveMaterial2Group (data) {
				const {data: res} = await this.axios.post("attachment/group-change", {
					uid          : localStorage.getItem('uid'),
					group_id     : data.groupId,
					attachment_id: data.ids
				});
				if (res.error != 0) {
					this.groupLoading = false
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.resetList()
				}
			},
			// 移动素材后重置
			resetList () {
				this.groupLoading = false
				this.groupVisible = false
				this.materialList = []
				this.selectedRowKeys = []
				if (this.material_type == 0) {
					this.getAllMaterial(1, this.allPageSize)
				} else {
					let params = this.getPageAndPageSize3()
					this.getMaterial(params.page, params.pageSize);
				}

				this.resetBatch()
				this.attachmentId = ''
				this.$refs.filemenu.getGroupList()
			},
			// 同步展示公众号弹窗
			showPop () {
				this.showWxModal = true
			},
			// 公众号弹窗回调
			modalVisibleChange (event, wxNum, wxNickName) {
				this.showWxModal = false
				if (event == 'ok') {
					this.refreshMaterial(wxNum, 1)
				}
			},
			// 同步素材
			async refreshMaterial (wxNum, is_pull) {
				let type = ''
				if (this.material_type == 1) {
					type = 2
				} else if (this.material_type == 2) {
					type = 3
				} else if (this.material_type == 3) {
					type = 4
				} else if (this.material_type == 4) {
					type = 1
				}
				const {data: res} = await this.axios.post("material/get-batch", {
					wx_id          : wxNum,
					material_type  : type,
					group_id       : this.groupId[0],
					is_pull        : is_pull,
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
				});
				if (res.error != 0) {
					this.setPoploading(false)
					this.$message.error(res.error_msg);
				} else {
					if (is_pull == 1) {
						this.setPoploading(true)
						this.refreshMaterial(wxNum, 0)
					} else {
						this.setPoploading(false)
						message.success("同步微信素材库已经进入队列");
						this.$nextTick(() => {
							this.$refs.filemenu.getGroupList()
						})
					}
				}
			},
			// 设置同步按钮loading
			setPoploading (flag) {
				if (this.material_type == 1) {
					this.picWxLoading = flag
				} else if (this.material_type == 2) {
					this.voiceWxLoading = flag
				} else if (this.material_type == 3) {
					this.videoWxLoading = flag
				} else if (this.material_type == 4) {
					this.sketchWxLoading = flag
				}
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
			// 修改emoji的显示与否的参数
			toggleDialogEmoji () {
				this.emojiShow = !this.emojiShow
			}
			,
			// 选择emoji表情的事件
			onSelectEmoji (dataEmoji) {
				var dom = this.mediumEditor.options.ownerDocument
				if (this.wordLimit - this.wordNum >= 2) {
					this.insertHTMLCommand(dom, dataEmoji.data)
				}
				// Optional
				this.toggleDialogEmoji()
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
			// 插件初始化成功的回调
			editorCreated (mediumEditor) {
				this.mediumEditor = mediumEditor
				this.mediumEditor.subscribe('focus', this.editableFocus);
				this.mediumEditor.subscribe('editableKeydown', this.editableKeydown);
				this.mediumEditor.subscribe('editablePaste', this.editablePaste);

				delete self.lastRange
				delete self.lastNode
			}
			,
			changeContentInput (operation) {
				if (operation.api.origElements.innerHTML == '' || operation.api.origElements.innerHTML == '<br>') {
					operation.api.origElements.innerHTML = '<p><br/></p>'
				}
				//判断链接格式
				// var reg = /href="(?![a-zA-z]+:\/\/)[^"]*/g
				// if (reg.test(operation.api.origElements.innerHTML)) {
				// 	this.$message.error('请填写正确的链接')
				// 	this.mediumEditor.execAction('unlink')
				// }
				this.wordNum = self.lastNode.textContent.length
				if (this.wordNum <= this.wordLimit) {
					if (this.attachmentId) {
						this.textContent = self.lastNode.innerHTML.replace(/<a([^>]*)>/g, '').replace(/<\/a>/g, '').replace(/<br([^>]*)>/g, '\n').replace(/&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>&nbsp;/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					} else {
						this.textContent = self.lastNode.innerHTML.replace(/<a([^>]*)>/g, '').replace(/<\/a>/g, '').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>&nbsp;/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					}
					this.textValue = operation.api.origElements.innerHTML.replace(/<a([^>]*)>/g, '').replace(/<\/a>/g, '').replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					console.log(this.textValue)
					console.log(this.textContent)
					// this.textContent = operation.api.origElements.innerHTML.replace(/<div>/g, '').replace(/<\/div>/g, '').replace(/<p>/g, '\n').replace(/<\/p>/g, '\n').replace(/<br>/g, '\n').replace(/<span>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
				} else {
					this.invlideText();
				}
			}
			,
			// 文本域获取焦点
			editableFocus (e) {
				if (e.target.innerHTML === '' || e.target.innerHTML == '<p></p>' || e.target.innerHTML == '<br>') {
					e.target.innerHTML = '<p><br/></p>';
				}
			}
			,
			//监听键盘事件，超过300字，不让输入
			editableKeydown (event) {
				if (this.wordNum >= this.wordLimit && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && !(event.keyCode == 65 && (event.metaKey || event.ctrlKey))) {
					event.preventDefault();
				}

				if (event.keyCode == 86 && (event.metaKey || event.ctrlKey)) {
					console.log(123)
				}
			}
			,
			//监听粘贴事件
			editablePaste (event, target) {
				this.invlideText()
			},
			// 插入自定义HTML
			insertHTMLCommand (doc, html) {
				if (typeof self.lastNode === 'undefined' || !self.lastNode.classList.contains("content-editable")) {
					return false
				}

				let range, toReplace, el, fragment, node, lastNode, ecArgs = ['insertHTML', false, html]

				range = self.lastRange
				toReplace = range.commonAncestorContainer

				if (editor.MediumEditor.util.isMediumEditorElement(toReplace) && !toReplace.firstChild) {
					range.selectNode(toReplace.appendChild(doc.createTextNode('')))
				} else if ((toReplace.nodeType === 3 && range.startOffset === 0 && range.endOffset === toReplace.nodeValue.length) ||
					(toReplace.nodeType !== 3 && toReplace.innerHTML === range.toString())) {
					// Ensure range covers maximum amount of nodes as possible
					// By moving up the DOM and selecting ancestors whose only child is the range
					while (!editor.MediumEditor.util.isMediumEditorElement(toReplace) &&
					toReplace.parentNode &&
					toReplace.parentNode.childNodes.length === 1 &&
					!editor.MediumEditor.util.isMediumEditorElement(toReplace.parentNode)) {
						toReplace = toReplace.parentNode
					}
					range.selectNode(toReplace)
				}
				range.deleteContents()

				el = doc.createElement('div')
				el.innerHTML = html
				fragment = doc.createDocumentFragment()
				while (el.firstChild) {
					node = el.firstChild
					lastNode = fragment.appendChild(node)
				}
				range.insertNode(fragment)

				// Preserve the selection:
				if (lastNode) {
					range = range.cloneRange()
					range.setStartAfter(lastNode)
					range.collapse(true)
					editor.MediumEditor.selection.selectRange(doc, range)
				}

				if (doc.execCommand.callListeners) {
					doc.execCommand.callListeners(ecArgs, true)
				}
				this.wordNum = self.lastNode.textContent.length
				if (this.wordNum <= this.wordLimit) {
					this.textValue = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					this.textContent = self.lastNode.innerHTML.replace(/<br([^>]*)>/g, '\n').replace(/&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>&nbsp;/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
				}

				let event = {
					currentTarget: this.mediumEditor.origElements
				}
				this.mediumEditor.events.updateInput(event.currentTarget, event);

			}
			,
			invlideText () {
				const customNode = this.$refs.medium_editor.$el
				const {startNode, startOffset, endNode, endOffset} = this.global.getRangeInfo(customNode, this.wordLimit);

				if (typeof startNode.nodeValue !== 'undefined') {
					let newRange = document.createRange()
					newRange.setStart(startNode, startOffset);
					newRange.setEnd(endNode, endOffset);
					// newSelection.removeAllRanges();
					// newSelection.addRange(newRange)
					newRange.deleteContents()

					this.textValue = self.lastNode.innerHTML.replace(/<a([^>]*)>/g, '').replace(/<\/a>/g, '').replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					if (this.attachmentId) {
						this.textContent = self.lastNode.innerHTML.replace(/<a([^>]*)>/g, '').replace(/<\/a>/g, '').replace(/<br([^>]*)>/g, '\n').replace(/&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>&nbsp;/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					} else {
						this.textContent = self.lastNode.innerHTML.replace(/<a([^>]*)>/g, '').replace(/<\/a>/g, '').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>&nbsp;/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					}
					this.wordNum = this.wordLimit

				}
				var divscll = document.getElementsByClassName('content-editable')[0];
				divscll.scrollTop = divscll.clientHeight
			},
		},

		computed: {
			// 文本列表选择
			rowSelection () {
				let that = this
				const {selectedRowKeys} = this;
				return {
					selectedRowKeys,
					onChange             : this.onSelectChange,
					hideDefaultSelections: true,
					// onSelect             : this.onSelectRow,
					selections           : [
						// {
						// 	key     : "current-data",
						// 	text    : "当前页",
						// 	onSelect: changableRowKeys => {
						// 		let that = this
						// 		let material = []
						// 		if (that.material_type == 7) {
						// 			material = this.materialList7
						// 		} else if (that.material_type == 4) {
						// 			material = this.materialList
						// 		} else if (that.material_type == 1) {
						// 			material = this.materialList2
						// 		} else if (that.material_type == 2) {
						// 			material = this.materialList3
						// 		} else if (that.material_type == 3) {
						// 			material = this.materialList4
						// 		} else if (that.material_type == 5) {
						// 			material = this.materialList6
						// 		}
						// 		material.map(item => {
						// 			let index = that.selectedRowKeys.findIndex((id) => id === item.id);
						// 			if (index >= 0) {
						// 				that.selectedRowKeys.splice(index, 1)
						// 			}
						// 		})
						// 		for (let i = 0; i < changableRowKeys.length; i++) {
						// 			that.selectedRowKeys.push(changableRowKeys[i])
						// 		}
						// 	}
						// },
						// {
						// 	key     : "all-data",
						// 	text    : "选择所有项",
						// 	onSelect: () => {
						// 		that.selectedRowKeys = [...that.materialKeys.valueOf()]
						// 	}
						// }
					],
					// onSelection          : this.onSelection
				};
			},
			itemWidth () {
				//（外层盒子最小宽度885px-滚动条宽度4px-每列间距10*3）/ 4列
				return (212.75 * (document.getElementsByClassName("content-hd")[0].clientWidth / 885))
			},
			itemHeight () {
				let height = (212.75 * (document.getElementsByClassName("content-hd")[0].clientWidth / 885) * 0.81) / 900.0 * 500
				let style = {
					height: height + 'px'
				}
				return style
			},
			itemAppletHeight () {
				let i = document.getElementsByClassName("applet")[0]
				let height = (212.75 * (document.getElementsByClassName("applet")[0].clientWidth / 885) * 0.81) / 1084 * 864
				let style = {
					height   : height + 'px',
					objectFit: 'cover'
				}
				return style
			},
			gutterWidth () {
				return (10 * (document.getElementsByClassName("content-hd")[0].clientWidth / 885));
			},
		},

		created () {
			if (this.$route.query.t) {
				this.material_type = this.$route.query.t || 1
			}
			const _this = this;
			_this.ws.setCallback(this.websocketOnMessage)
			document.addEventListener("selectionchange", function () {
				_this.getCursor(self)
			})
		},
		mounted () {
			let that = this
			document.getElementsByClassName('fans-content')[0].onscroll = function () {
				if (that.material_type == 4) {
					//变量scrollTop是滚动条滚动时，距离顶部的距离
					let scrollTop = document.getElementsByClassName('fans-content')[0].scrollTop;
					//变量windowHeight是可视区的高度
					let windowHeight = document.getElementsByClassName('fans-content')[0].clientHeight || document.body.clientHeight;
					//变量scrollHeight是滚动条的总高度
					let scrollHeight = document.getElementsByClassName('fans-content')[0].scrollHeight || document.body.scrollHeight;
					//滚动条到底部的条件
					if (scrollTop + windowHeight == scrollHeight) {
						if (that.sketchType == 0) {
							if (Math.ceil(that.materialListTotal / 16.0) > that.page2) {
								that.getMaterial(that.page2 + 1, that.pageSize2)
							}
						}
					}
				}
			}
		},
		beforeRouteEnter (to, from, next) {
			// 在渲染该组件的对应路由被 confirm 前调用
			// 不！能！获取组件实例 `this`
			// 因为当守卫执行前，组件实例还没被创建
			if (from.path == '/filingCabinet/add' && typeof to.query.groupId != 'undefined') {
				next(vm => {
					vm.groupId = to.query.groupId.split(',')
					vm.selectedRowKeys = []
					vm.checkBoxValue = []
					vm.batchFlag = 1
					vm.$refs.filemenu.id = to.query.groupId
					vm.$refs.filemenu.getGroupList()
				});
			}

			if (from.path != '/filingCabinet/info' && from.path != '/filingCabinet/add') {
				next(vm => {
					//因为当钩子执行前，组件实例还没被创建
					// vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
					vm.material_type = '0'
					vm.groupId = []
					vm.allPage = 1
					vm.allPageSize = 15
					vm.batchType = '1'
					vm.batchTypeValue = false
					vm.selectedRowKeys = []
					vm.checkBoxValue = []
					vm.batchFlag = 1
					vm.name = ''
					vm.$refs.filemenu.id = ''
					vm.$refs.filemenu.getGroupList()
				});
			}

			next()
		},
	};
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/default.css";
	@import "../../../style/medium-editor-toolbar.css";

	/deep/ .inputTitle2 {
		padding: 20px;

		p {
			word-break: break-word;
			width: calc(100% - 74px);
			overflow: hidden;
			text-overflow: -o-ellipsis-lastline;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 4;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			/*float: left;*/
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

	/deep/ .ant-card-head {
		padding: 0 16px;
		border-bottom: 0;
	}

	/deep/ .ant-card-meta-title {
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
		width: 100%;
		min-width: 885px;
		padding: 0 20px;
		margin: 0 0 35px 0;
		text-align: left;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		/* border: 1px solid #E2E2E2; */
		min-width: 885px;
		width: 100%;
		margin-top: 30px;
		padding-bottom: 30px;
		/*background: rgb(240, 242, 245);*/
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

	.sider-one {
		padding: 0 20px;
	}

	.sider-one-txt {
		height: 60px;
		line-height: 60px;
		text-align: left;
	}

	/*.selectWx {*/
	/*	width: 200px;*/
	/*	margin-left: 20px;*/
	/*	height: 50px;*/
	/*	line-height: 50px;*/
	/*	cursor: pointer;*/
	/*	padding-left: 10px;*/
	/*}*/

	.active {
		background: #01b065;
		color: white;
	}

	/deep/ .ant-card-cover img {
		width: 90%;
		height: 136.56px;
		display: block;
		margin: auto;
	}

	/deep/ .ant-card-body {
		padding: 16px 0 9px 0 !important;
		width: 90%;
		margin: 0 auto;
	}

	/deep/ .ant-card-head-title {
		color: #999;
	}

	/deep/ .ant-tabs-tabpane {
		display: flex;
		flex-wrap: wrap;
	}

	.oddCard {
		width: 25%;
		margin-bottom: 35px;
		display: inline-block;
		/*float: left;*/
	}

	/deep/ .ant-tabs {
		width: 100%;
	}

	/deep/ .ant-tabs-bar {
		/*margin: 0 0 0px 0;*/
		border-bottom: 1px solid #DDD;
	}

	/deep/ .ant-card-hoverable:hover {
		box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.15) !important;
	}

	.phoneView-txt {
		width: 100%;
		background: @color-bgc;
		border: 1px solid @border-color;
		margin-top: 20px;
		padding: 5px;
		font-size: 12px;
	}

	/deep/ .ant-card-meta-detail {
		line-height: 64px;
	}

	/deep/ .ant-card-meta-avatar {
		float: right;
		padding-right: 0;
	}

	/deep/ .ant-card-meta {
		margin-bottom: 10px;
		margin-top: 10px;
	}

	/deep/ .anticon svg {
		margin-bottom: -2px;
	}

	.evenCard {
		margin-bottom: 35px;
	}

	.audio {
		width: 100%;
		height: 52px;
		margin-top: 5px;
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

	.preview-modal {
		.ant-carousel {
			.slick-slide {
				text-align: center;
				height: auto;
				overflow: hidden;
			}

			.custom-slick-arrow {
				width: 50px;
				height: 50px;
				font-size: 50px;
				color: #545454 !important;
				opacity: 0.3;

				&:before {
					display: none;
				}

				&:hover {
					opacity: 0.5;
				}
			}
		}
	}

	.account-filter {
		margin-bottom: 20px;
		height: 48px;
		background: #F7F7F7;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		border-top: 1px solid #E9E9E9;
		border-right: 1px solid #E9E9E9;
		border-bottom: 1px solid #E9E9E9;
	}

	.account-filter-contain {
		width: 80%;
		width: -moz-calc(100% - 224px);
		width: -webkit-calc(100% - 224px);
		width: calc(100% - 224px);
		min-width: 350px;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
	}

	.account-filter-item {
		color: #1A1A1A;
		width: 120px;
		cursor: pointer;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		padding: 12px 0 12px 2px;
		font-size: 14px;
	}

	.account-filter-item.active {
		background: #FFF;
		border: 1px solid #E9E9E9;
		height: 56px;
		margin-top: -8px;
		border: 1px solid #E0E0E0;
		border-bottom: 0;
		padding-top: 19px;
	}

	.content-msg1 {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 0px 0px 10px 20px;
		text-align: left;
	}

	.content-msg1 a:link {
		color: #01b065;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.content-msg1 a:visited {
		color: #01b065;
		text-decoration: none;
	}

	.content-msg {
		min-width: 845px;
		width: calc(100% - 40px);
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 20px 0px 0px 20px;
		text-align: left;

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

	/deep/ .media-content {
		border-radius: 5px;
		display: block;
	}

	/deep/ img {
		&.media-content {
			cursor: pointer;
		}
	}

	/deep/ .wrong-notice {
		padding: 8px 11px;
		word-break: normal;
		word-wrap: break-word;
		overflow-wrap: break-word;
		display: inline-block;
	}

	/deep/ .vue-waterfall {
		height: 100% !important;
		overflow: hidden;
		margin-bottom: 20px;
	}

	/deep/ .video-js .vjs-control {
		width: 0 !important;
		/*max-width: 4em!important;*/
		min-width: 33px !important;
	}

	/deep/ .ant-tabs-nav-scroll {
		background-color: #FFFFFF;
	}

	.upload-wrap {
		width: 96px;
		height: 96px;
		text-align: center;
		border: 1px dashed #D8D8D8;
		background: #FFF;
		cursor: pointer;
		margin-bottom: 10px;
	}

	.upload-plus {
		font-size: 32px;
		line-height: 96px;
		font-weight: 300;
		color: #686868;
	}

	/deep/ .ant-form-item-children {
		display: block;
	}

	/deep/ .ant-form-item-children .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px !important;
	}

	.file-name {
		float: right;
		max-width: calc(100% - 90px);
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.upload-file-name {
		max-width: 100%;
		max-height: 100%;
		margin-left: 50%;
		margin-top: 50%;
		transform: translate(-50%, -50%);
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	.content-editable {
		font-size: 14px;
		line-height: 21px;
		padding: 15px;
		height: 110px;
		overflow: auto;

		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

	.content-editable {
		font-size: 14px;
		line-height: 21px;
		padding: 15px;
		height: 110px;
		overflow: auto;
		border: 1px solid rgba(0, 0, 0, 0.15);

		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
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

	/deep/ .ant-upload-list {
		display: none;
	}

	/deep/ .ant-upload.ant-upload-select {
		margin-right: 10px;
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

	/deep/ .ant-checkbox-indeterminate .ant-checkbox-inner::after {
		width: 12px;
		height: 12px;
		transform: scale(1) translate(-50%, -50%);
	}

	.sketch-type-activity {
		color: #01b065;
	}
</style>