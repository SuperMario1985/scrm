<template>
	<a-modal v-if="materialVisible" :visible="materialVisible" title="选择内容" width="888px!important"
	         @cancel="cancelChoose">
		<template slot="footer">
			<a-button key="back" @click="cancelChoose">取消</a-button>
			<a-button
					key="submit"
					type="primary"
					@click="chooseMsg"
			>确定
			</a-button>
		</template>
		<div class="list" ref="List">
			<div id="components-layout-demo-basic">
				<a-layout style="position: relative;">
					<a-layout-sider>
						<!-- 公众号 -->
						<FileMenu :is_edit="0" @changeGroupId='changeGroupId' ref="filemenu"></FileMenu>
					</a-layout-sider>
					<a-layout
							style="position: absolute;left:200px;top:0;bottom:0;right:0;overflow-x: hidden; overflow-y: auto;"
							class="scroll fans-content"
					>
						<a-layout-content>
							<!-- 表格部分 -->
							<div class="content-bd">
								<div class="account-filter">
									<div class="account-filter-contain">
										<div v-show="!isMoveType" class="account-filter-item" @click="callback ('6')"
										     :class="material_type == 6?'active':''"
										     style="min-width: 20px;border-left: 0px;">
											<p style="width: 120px;margin: 0px;text-align: center;">
												文本
											</p>
										</div>
										<div v-show="!isMoveType" class="account-filter-item" @click="callback ('4')"
										     :class="material_type == 4?'active':''"
										     style="min-width: 20px;">
											<p style="width: 120px;margin: 0px;text-align: center;">
												图文
											</p>
										</div>
										<div v-show="!isMoveType" class="account-filter-item" @click="callback ('5')"
										     :class="material_type == 5?'active':''"
										     style="min-width: 20px;">
											<p style="width: 120px;margin: 0px;text-align: center;">
												文件
											</p>
										</div>
										<div class="account-filter-item" @click="callback ('1')"
										     :class="material_type == 1?'active':''"
										     style="min-width: 20px;">
											<p style="width: 120px;margin: 0px;text-align: center;">
												图片
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
									</div>
								</div>
								<a-spin tip="Loading..." size="large" :spinning="isLoading">

									<!-- 图文 -->
									<div v-show="material_type == 4">
										<div class="content-hd">
											<div style="height: 32px;margin-bottom: 10px;line-height: 32px;">
												共有
												<span style="color: blue">{{materialListTotal}}</span>个素材，当前类型已选中
												<span style="color: #FF562D;">{{selectedRowKeys[material_type].length}}</span>
												个
												<a-button v-if="selectedRowKeys[material_type].length > 0" type="link" @click="clearSelectByType(material_type)"
												          style="margin-left: 5px;">
													重新勾选
												</a-button>
											</div>
											<div style="margin-bottom: 25px;">
												<a-input
														placeholder="输入要搜索的内容"
														v-model="name"
														:allowClear=true
														style="width: 200px;"
												></a-input>
												<a-select
														showSearch
														optionFilterProp="children"
														style="width: 140px;margin-left: 10px;"
														v-model="isRadar"
												>
													<a-select-option :value="0">雷达状态</a-select-option>
													<a-select-option :value="1">非雷达链接</a-select-option>
													<a-select-option :value="2">雷达链接</a-select-option>
												</a-select>
												<a-button @click="onSearch" type="primary" style="margin-left: 10px;">
													查找
												</a-button>
												<a-button @click="clearInput" style="margin-left: 10px;">
													清空
												</a-button>
											</div>
											<div style="margin: 100px;height: 400px;text-align: center;"
											     v-show="materialListTotal == 0?true:false">
												<img src="../../assets/null.png"
												     style="width: 150px;display: block;margin: auto"/>
												<p style="text-align: center;">暂无数据</p>
											</div>
											<div>
												<div class="evenCard"
												     v-for="(item,index) in materialList" v-has="'material-list'">
													<!--单图文-->
													<a-card
															v-if="item.artList.length == 1"
															hoverable
															style="width: 100%;margin:auto;"
													>
														<div slot="title">
															<a-icon v-if="item.radar_status == 1 && item.radar_id > 0"
															        type="radar-chart"
															        style="vertical-align: top;font-size: 18px;color: #3CB371;"/>
															<a-checkbox style="float: right"
															            v-hasMore2one="'material-remove,material-delete'"
															            v-model="checkBoxValue[index]"
															            @click="changeSelectKey(item)"></a-checkbox>
														</div>
														<img
																style="object-fit: contain;height: 111px;"
																alt="example"
																draggable="false"
																:src="commonUrl+(item.artList[0].s_local_path || item.artList[0].local_path)"
																slot="cover"
														/>
														<div
																style="font-size: 12px;height: 24px;line-height: 24px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px;margin-top: -24px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
														>{{item.artList[0].title}}
														</div>
													</a-card>
												</div>
												<!-- 图文分页 -->
												<div style="width: 100%;padding: 0 20px 20px;"
												     v-show="materialListTotal>0"
												     v-has="'material-list'">
													<div class="pagination" style="height: 32px;float: right;">
														<a-pagination
																:total="materialListTotal"
																showSizeChanger
																:showQuickJumper="false"
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
									</div>
									<!--图片-->
									<div style="height: auto;" v-show="material_type == 1">
										<div class="content-hd">
											<div style="overflow: hidden;margin-bottom: 25px;">
												<div style="height: 32px;margin-bottom: 10px;line-height: 32px;">
													共有<span style="color: blue">{{total}}</span>个素材，当前类型已选中
													<span style="color: #FF562D;">{{selectedRowKeys[material_type].length}}</span>
													个
													<a-button v-if="selectedRowKeys[material_type].length > 0" type="link" @click="clearSelectByType(material_type)"
													          style="margin-left: 5px;">
														重新勾选
													</a-button>
												</div>
												<div>
													<a-input
															placeholder="输入要搜索的内容"
															v-model="name"
															:allowClear=true
															style="width: 200px;"
													></a-input>
													<a-select
															showSearch
															optionFilterProp="children"
															style="width: 140px;margin-left: 10px;"
															v-model="isRadar"
													>
														<a-select-option :value="0">雷达状态</a-select-option>
														<a-select-option :value="1">非雷达链接</a-select-option>
														<a-select-option :value="2">雷达链接</a-select-option>
													</a-select>
													<a-button @click="onSearch" type="primary"
													          style="margin-left: 10px;">
														查找
													</a-button>
													<a-button @click="clearInput" style="margin-left: 10px;">
														清空
													</a-button>
												</div>
											</div>
											<div style="margin: 100px;height: 400px;text-align: center;"
											     v-show="materialList2.length == 0?true:false">
												<img src="../../assets/null.png"
												     style="width: 150px;display: block;margin: auto;-o-object-fit: cover;"/>
												<p style="text-align: center;">暂无数据</p>
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
											<div class="oddCard" v-for="(item2,index) in materialList2"
											     :key="item2.id" v-has="'material-list'">
												<a-card hoverable style="width: 100%;margin:auto;">
													<div slot="title">
														<a-icon v-if="item2.radar_status == 1 && item2.radar_id > 0"
														        type="radar-chart"
														        style="vertical-align: top;font-size: 17px;color: #3CB371;"/>
														<a-checkbox style="float: right;" v-model="checkBoxValue[index]"
														            v-hasMore2one="'material-remove,material-delete'"
														            @click="changeSelectKey(item2)"></a-checkbox>
													</div>
													<img :id="item2.id" alt="example"
													     :src="commonUrl+(item2.s_local_path || item2.local_path)"
													     slot="cover"
													     style="object-fit: contain;"
													     @click="previewPic(index)"/>
													<a-popover placement="top"
													           v-has="'material-add'">
														<template slot="content">
															<p style="max-width: 150px;margin-bottom: 0px;word-break: break-all;">
																{{item2.file_name}}</p>
														</template>
														<div style="font-size: 12px;height: 24px;line-height: 24px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px;margin-top: -24px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
															{{item2.file_name}}
														</div>
													</a-popover>
												</a-card>
											</div>
											<!-- 图片分页 -->
											<div style="width: 100%;padding: 0 20px 20px;" v-show="total>0"
											     v-has="'material-list'">
												<div class="pagination" style="height: 32px;float: right;">
													<a-pagination
															:total="total"
															showSizeChanger
															:showQuickJumper="false"
															:current="page"
															:pageSize="pageSize"
															:pageSizeOptions="['15','30','50','100']"
															@change="changePage"
															@showSizeChange="showSizeChange"
													/>
												</div>
											</div>
										</div>
									</div>
									<!--视频-->
									<div v-if="material_type == 3">
										<div class="content-hd">
											<div style="height: 32px;line-height: 32px;margin-bottom: 10px;">
												共有<span style="color: blue">{{total4}}</span>个素材，当前类型已选中
												<span style="color: #FF562D;">{{selectedRowKeys[material_type].length}}</span>
												个
												<a-button v-if="selectedRowKeys[material_type].length > 0" type="link" @click="clearSelectByType(material_type)"
												          style="margin-left: 5px;">
													重新勾选
												</a-button>
											</div>
											<div style="margin-bottom: 25px;">
												<a-input
														placeholder="输入要搜索的内容"
														v-model="name"
														:allowClear=true
														style="width: 200px;"
												></a-input>
												<a-select
														showSearch
														optionFilterProp="children"
														style="width: 140px;margin-left: 10px;"
														v-model="isRadar"
												>
													<a-select-option :value="0">雷达状态</a-select-option>
													<a-select-option :value="1">非雷达链接</a-select-option>
													<a-select-option :value="2">雷达链接</a-select-option>
												</a-select>
												<a-button @click="onSearch" type="primary" style="margin-left: 10px;">
													查找
												</a-button>
												<a-button @click="clearInput" style="margin-left: 10px;">
													清空
												</a-button>
											</div>
											<div style="height: 400px;text-align: center;margin: 100px;"
											     v-show="materialList4.length == 0?true:false">
												<img src="../../assets/null.png"
												     style="width: 150px;display: block;margin: auto;"/>
												<p style="text-align: center;">暂无数据</p>
											</div>
											<div class="videoCard" v-for="(item4,index4) in materialList4"
											     :key="item4.id"
											     v-has="'material-list'">
												<!--										:id="item4.id" draggable="true" @dragstart="drag"-->
												<a-card hoverable style="width: 100%;margin:auto;">
													<div slot="title">
														<a-icon v-if="item4.radar_status == 1 && item4.radar_id > 0"
														        type="radar-chart"
														        style="vertical-align: top;font-size: 18px;color: #3CB371;"/>
														<a-checkbox v-hasMore2one="'material-remove,material-delete'"
														            style="float: right" v-model="checkBoxValue[index4]"
														            @click="changeSelectKey(item4)"></a-checkbox>
													</div>
													<video-player
															class="video-player vjs-custom-skin"
															ref="videoPlayer"
															:playsinline="true"
															:options="playerOptions[index4]"
													></video-player>
													<div style="height: 24px;line-height: 24px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
														{{item4.file_name}}
													</div>
												</a-card>
											</div>
											<!-- 视频分页 -->
											<div style="width: 100%;padding: 0 20px 20px;" v-if="total4>0"
											     v-has="'material-list'">
												<div class="pagination"
												     style="height: 32px;display: inline-block;float: right">
													<a-pagination
															:total="total4"
															showSizeChanger
															:showQuickJumper="false"
															:current="page4"
															:pageSize="pageSize4"
															:pageSizeOptions="['15','30','50','100']"
															@change="changePage4"
															@showSizeChange="showSizeChange4"
													/>
												</div>
											</div>
										</div>
									</div>
									<!--文件-->
									<div style="height: auto;" v-show="material_type == 5">
										<div class="content-hd">
											<div style="overflow: hidden;margin-bottom: 25px;">
												<div style="height: 32px;margin-bottom: 10px;line-height: 32px;">
													共有<span style="color: blue">{{total6}}</span>个素材，当前类型已选中
													<span style="color: #FF562D;">{{selectedRowKeys[material_type].length}}</span>
													个
													<a-button v-if="selectedRowKeys[material_type].length > 0" type="link" @click="clearSelectByType(material_type)"
													          style="margin-left: 5px;">
														重新勾选
													</a-button>
												</div>
												<div style="float: left;">
													<a-input
															placeholder="输入要搜索的内容"
															v-model="name"
															:allowClear=true
															style="width: 200px;"
													></a-input>
													<a-select
															showSearch
															optionFilterProp="children"
															style="width: 140px;margin-left: 10px;"
															v-model="isRadar"
													>
														<a-select-option :value="0">雷达状态</a-select-option>
														<a-select-option :value="1">非雷达链接</a-select-option>
														<a-select-option :value="2">雷达链接</a-select-option>
													</a-select>
													<a-button @click="onSearch" type="primary"
													          style="margin-left: 10px;">
														查找
													</a-button>
													<a-button @click="clearInput" style="margin-left: 10px;">
														清空
													</a-button>
												</div>
											</div>

											<div style="margin: 100px;height: 400px;text-align: center;"
											     v-show="materialList6.length == 0?true:false">
												<img src="../../assets/null.png"
												     style="width: 150px;display: block;margin: auto;"/>
												<p style="text-align: center;">暂无数据</p>
											</div>
											<div class="oddCard"
											     v-for="(item6,index) in materialList6"
											     :key="item6.id" v-has="'material-list'">
												<a-card
														hoverable
														style="width: 100%;margin:auto;"
												>
													<div slot="title">
														<a-icon v-if="item6.radar_status == 1 && item6.radar_id > 0"
														        type="radar-chart"
														        style="vertical-align: top;font-size: 18px;color: #3CB371;"/>
														<a-checkbox v-hasMore2one="'material-remove,material-delete'"
														            style="float: right" v-model="checkBoxValue[index]"
														            @click="changeSelectKey(item6)"></a-checkbox>
													</div>
													<div>
														<img
																alt="example" v-if="item6.extension == 'doc'"
																style="width: 80px;height: 80px;margin: 5px 16px !important;"
																src="../../assets/fileIcon/doc.png"
																slot="cover"
														/>
														<img
																alt="example" v-if="item6.extension == 'docx'"
																style="width: 80px;height: 80px;margin: 5px 16px !important;"
																src="../../assets/fileIcon/docx.png"
																slot="cover"
														/>
														<img
																alt="example" v-if="item6.extension == 'xlsx'"
																style="width: 80px;height: 80px;margin: 5px 16px !important;"
																src="../../assets/fileIcon/xlsx.png"
																slot="cover"
														/>
														<img
																alt="example" v-if="item6.extension == 'xls'"
																style="width: 80px;height: 80px;margin: 5px 16px !important;"
																src="../../assets/fileIcon/xls.png"
																slot="cover"
														/>
														<img
																alt="example" v-if="item6.extension == 'csv'"
																style="width: 80px;height: 80px;margin: 5px 16px !important;"
																src="../../assets/fileIcon/csv.png"
																slot="cover"
														/>
														<img
																alt="example" v-if="item6.extension == 'pptx'"
																style="width: 80px;height: 80px;margin: 5px 16px !important;"
																src="../../assets/fileIcon/pptx.png"
																slot="cover"
														/>
														<img
																alt="example" v-if="item6.extension == 'ppt'"
																style="width: 80px;height: 80px;margin: 5px 16px !important;"
																src="../../assets/fileIcon/ppt.png"
																slot="cover"
														/>
														<img
																alt="example" v-if="item6.extension == 'txt'"
																style="width: 80px;height: 80px;margin: 5px 16px !important;"
																src="../../assets/fileIcon/txt.png"
																slot="cover"
														/>
														<img
																alt="example" v-if="item6.extension == 'pdf'"
																style="width: 80px;height: 80px;margin: 5px 16px !important;"
																src="../../assets/fileIcon/pdf.png"
																slot="cover"
														/>
														<img
																alt="example" v-if="item6.extension == 'xmind'"
																style="width: 80px;height: 80px;margin: 5px 16px !important;"
																src="../../assets/fileIcon/xmind.png"
																slot="cover"
														/>
														<a-popover placement="top"
														           v-has="'material-add'">
															<template slot="content">
																<p style="max-width: 150px;margin-bottom: 0px;word-break: break-all;">
																	{{item6.file_name}}</p>
															</template>
															<div style="font-size: 12px;height: 24px;line-height: 24px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px;margin-top: -24px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																{{item6.file_name}}
															</div>
														</a-popover>
													</div>
												</a-card>
											</div>
											<!-- 文件分页 -->
											<div style="width: 100%;padding: 0 20px 20px;" v-show="total6>0"
											     v-has="'material-list'">
												<div class="pagination" style="height: 32px;float: right;">
													<a-pagination
															:total="total6"
															showSizeChanger
															:showQuickJumper="false"
															:current="page6"
															:pageSize="pageSize6"
															:pageSizeOptions="['15','30','50','100']"
															@change="changePage6"
															@showSizeChange="showSizeChange6"
													/>
												</div>
											</div>
										</div>
									</div>
									<!--文本-->
									<div style="height: auto;" v-show="material_type == 6">
										<div class="content-hd">
											<div style="overflow: hidden;margin-bottom: 11px;">
												<div style="height: 32px;margin-bottom: 10px;line-height: 32px;">
													共有
													<span style="color: blue">{{total7}}</span>个素材，当前类型已选中
													<span style="color: #FF562D;">{{selectedRowKeys[material_type].length}}</span>
													个
													<a-button v-if="selectedRowKeys[material_type].length > 0" type="link" @click="clearSelectByType(material_type)"
													          style="margin-left: 5px;">
														重新勾选
													</a-button>
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
											</div>
											<div style="margin: 100px;height: 400px;text-align: center;"
											     v-show="total7 == 0?true:false">
												<img src="../../assets/null.png"
												     style="width: 150px;display: block;margin: auto"/>
												<p style="text-align: center;">暂无数据</p>
											</div>
											<div class="wordCard"
											     v-for="(item7,index) in materialList7"
											     :key="item7.id" v-has="'material-list'">
												<a-card
														hoverable
														style="width: 100%;margin:auto;"
												>
													<div slot="title">
														<span style="font-size: 13px;width: calc(100% - 25px); display: inline-block; vertical-align: middle; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item7.file_name}}</span>
														<a-checkbox v-hasMore2one="'material-remove,material-delete'"
														            style="float: right" v-model="checkBoxValue[index]"
														            @click="changeSelectKey(item7)"></a-checkbox>
													</div>
													<div>
														<a-popover>
															<template slot="content">
																<p style="max-width: 700px;word-break:break-all;word-wrapL:break-word;"
																   v-html="item7.content.replace(/\n/g, '<br/>')"></p>
															</template>
															<div class="inputTitle2">
																<p v-html="item7.content.replace(/\n/g, '<br/>')"></p>
															</div>
														</a-popover>
													</div>
												</a-card>
											</div>
											<!-- 文本分页 -->
											<div style="width: 100%;padding: 0 20px 20px;" v-show="total7>0"
											     v-has="'material-list'">
												<div class="pagination" style="height: 32px;float: right;">
													<a-pagination
															:total="total7"
															showSizeChanger
															:showQuickJumper="false"
															:current="page7"
															:pageSize="pageSize7"
															:pageSizeOptions="['15','30','50','100']"
															@change="changePage7"
															@showSizeChange="showSizeChange7"
													/>
												</div>
											</div>
										</div>
									</div>
									<!--小程序-->
									<div class="applet" style="height: auto;" v-show="material_type == 7">
										<div class="content-hd">
											<div style="overflow: hidden;margin-bottom: 35px;">
												<div style="height: 32px;margin-bottom: 10px;line-height: 32px;">
													共有<span style="color: blue">{{total5}}</span>个素材，当前类型已选中
													<span style="color: #FF562D;">{{selectedRowKeys[material_type].length}}</span>
													个
													<a-button v-if="selectedRowKeys[material_type].length > 0" type="link" @click="clearSelectByType(material_type)"
													          style="margin-left: 5px;">
														重新勾选
													</a-button>
												</div>
												<div style="float: left;">
													<a-input
															placeholder="输入要搜索的内容"
															v-model="name"
															:allowClear=true
															style="width: 200px;"
													/>
													<a-button @click="onSearch" type="primary"
													          style="margin-left: 10px;">
														查找
													</a-button>
													<a-button @click="clearInput" style="margin-left: 10px;">
														清空
													</a-button>
												</div>
											</div>
											<div style="margin: 100px;height: 400px;text-align: center;" v-show="materialList5.length == 0?true:false">
												<img src="../../assets/null.png" style="width: 150px;display: block;margin: auto;"/>
												<p style="text-align: center;">暂无数据</p>
											</div>
											<!--										:id="item5.id" draggable="true" @dragstart="drag"-->
											<div class="videoCard"
											     v-for="(item5,index) in materialList5"
											     :key="item5.id" v-has="'material-list'">
												<!--											<div style="width: 90%;margin: auto; color: rgba(0,0,0, 0.2)">-->
												<!--												新增于{{item5.file_name}}-->
												<!--											</div>-->
												<a-card
														hoverable
														style="width: 100%;margin:auto;"
												>
													<div slot="title">
														<a-checkbox v-hasMore2one="'material-remove,material-delete'"
														            style="float: right" v-model="checkBoxValue[index]"
														            @click="changeSelectKey(item5)"></a-checkbox>
													</div>
													<img :id="item5.id"
													     alt="example"
													     style="height: 155px;object-fit: cover;"
													     :src="commonUrl+item5.local_path"
													     slot="cover"
													/>
													<a-popover placement="top"
													           v-has="'material-add'">
														<template slot="content">
															<p style="max-width: 150px;margin-bottom: 0px;word-break: break-all;">
																{{item5.file_name}}</p>
														</template>
														<div style="font-size: 12px;height: 24px;line-height: 24px;background: #0F0F0F;opacity: 0.6;color: #FFF;padding: 0 10px;margin-top: -24px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
															{{item5.file_name}}
														</div>
													</a-popover>
												</a-card>
											</div>
											<!-- 小程序分页 -->
											<div style="width: 100%;padding: 0 20px 20px;" v-show="total5>0"
											     v-has="'material-list'">
												<div class="pagination" style="height: 32px;float: right;">
													<a-pagination
															:total="total5"
															showSizeChanger
															:showQuickJumper="false"
															:current="page5"
															:pageSize="pageSize5"
															:pageSizeOptions="['15','30','50','100']"
															@change="changePage5"
															@showSizeChange="showSizeChange5"
													/>
												</div>
											</div>
										</div>
									</div>

								</a-spin>
							</div>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</div>
		</div>
	</a-modal>
</template>

<script>
	import {videoPlayer} from "vue-video-player"
	import FileMenu from '../foldMenu/FileMenu'
	import "video.js/dist/video-js.css"
	import moment from "moment"

	export default {
		name      : "list",
		props     : {
			materialVisible: {
				type   : Boolean,
				default: false
			}
		},
		components: {
			videoPlayer,
			FileMenu,
		},
		inject    : ['getFileType'],
		data () {
			return {
				selectedRowKeys  : {
					6: [],
					4: [],
					5: [],
					1: [],
					3: [],
					7: [],
				},    // 选中的素材key
				selectedList     : {
					6: [],
					4: [],
					5: [],
					1: [],
					3: [],
					7: [],
				},    // 选中的素材数据
				checkBoxValue    : [],    // 多选框是否选中
				chooseId         : 0,  // 选中的素材id
				isLoading        : true, //Loading 组件显示与隐藏
				groupId          : [], // 选中的小组id
				isMoveType       : [], // 是否是渠道码 ""不是 1~6是
				materialList     : [],//图文素材列表
				materialListTotal: 0, //图文素材列表总条数
				sketchPage       : 1, // 图文列表分页
				sketchPageSize   : 15, // 图文列表页码
				sketchColomns    : [
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
						width      : "40%",
						scopedSlots: {customRender: "content"}
					},
					{
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px',
					},
				],
				materialList2    : [], //图片素材列表
				materialList3    : [], //视频素材列表
				materialList4    : [], //音频素材列表
				material_type    : '6', //4图文，1图片，2音频，3视频, 7小程序，5文件，6文本
				//上传图片
				imageColomns     : [
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
						scopedSlots: {customRender: "content"}
					},
					{
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px'
					},
				],
				previewVisible   : false, //预览图片的弹窗显示与隐藏
				name             : "", //图片标题
				isRadar          : 0,
				page             : 1, //图片素材页数
				pageSize         : 15, //图片素材每页个数
				total            : 0, //图片素材总条数
				quickJumper      : false, // 是否显示快速跳转的控件
				voiceColomns     : [
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
						scopedSlots: {customRender: "content"}
					},
					{
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px'
					}
				],
				page3            : 1, //音频素材页数
				pageSize3        : 15, //音频素材每页个数
				total3           : 0, //音频素材总条数
				quickJumper3     : false, //音频素材是否显示快速跳转的控件
				page4            : 1, //视频素材页数
				pageSize4        : 15, //视频素材每页个数
				total4           : 0, //视频素材总条数
				quickJumper4     : false, //视频素材是否显示快速跳转的控件
				publicOptions    : {
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
				playerOptions    : [],
				commonUrl        : this.$store.state.commonUrl,//公共的链接
				materialList6    : [], // 文件素材
				fileColomns      : [
					{
						title      : "",
						dataIndex  : "checkedBox",
						key        : "checkedBox",
						width      : '40px',
						scopedSlots: {customRender: "checkedBox"}
					},
					{
						title      : "文件名",
						dataIndex  : "file_name",
						key        : "file_name",
						width      : "15%",
						scopedSlots: {customRender: "file_name"}
					},
					{
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px'
					}
				],
				page6            : 1, //文件素材页数
				pageSize6        : 15, //文件素材每页个数
				total6           : 0, //文件素材总条数
				quickJumper6     : false,
				textColomns      : [
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
						title    : "素材来源",
						dataIndex: "group_name",
						key      : "group_name",
						width    : '180px'
					},
				], // 文本表格列
				materialList7    : [], // 文本
				page7            : 1, //文本素材页数
				pageSize7        : 15, //文本素材每页个数
				total7           : 2, //文本素材总条数
				quickJumper7     : false,
				materialList5    : [], // 小程序素材
				page5            : 1, //小程序素材页数
				pageSize5        : 15, //小程序素材每页个数
				total5           : 0, //小程序素材总条数
				quickJumper5     : false,
			};
		},
		watch     : {
			materialVisible: {
				handler (newVal) {
					this.selectedRowKeys = {
						6: [],
						4: [],
						5: [],
						1: [],
						3: [],
						7: [],
					}
					this.selectedList = {
						6: [],
						4: [],
						5: [],
						1: [],
						3: [],
						7: [],
					}
				},
				deep: true
			},
		},
		methods   : {
			cancelChoose () {
				this.$emit('chooseMsg', 'cancle')
			},
			chooseMsg () {
				this.$emit('chooseMsg', 'ok', this.selectedRowKeys, this.selectedList)
			},
			// 左侧切换小组回调
			changeGroupId (id, isMoveType) {
				this.isMoveType = isMoveType
				if (isMoveType) {
					this.material_type = '1'
				}
				this.groupId = id
				this.name = ''
				this.isRadar = 0
				this.materialList = []
				let params = this.getPageAndPageSize3()
				this.getMaterial(params.page, params.pageSize)
			},
			// 卡片选择
			changeSelectKey (item) {
				let key = item.key
				for (let i = 0; i < this.selectedRowKeys[item.file_type].length; i++) {
					if (key == this.selectedRowKeys[item.file_type][i]) {
						this.selectedRowKeys[item.file_type].splice(i, 1)
						this.selectedList[item.file_type].splice(i, 1)
						this.setBox(item.file_type)
						return false
					}
				}
				this.selectedRowKeys[item.file_type].push(key)
				this.selectedList[item.file_type].push({
					id       : key,
					file_name: item.file_type == 4 ? item.artList[0].title : item.file_name,
					type     : item.file_type,
					extension: item.extension
				})
				this.setBox(item.file_type)
			},
			setBox (type) {
				if (this.material_type == 1) {
					this.setCheckedBox(this.materialList2, type)
				} else if (this.material_type == 3) {
					this.setCheckedBox(this.materialList4, type)
				} else if (this.material_type == 4) {
					this.setCheckedBox(this.materialList, type)
				} else if (this.material_type == 5) {
					this.setCheckedBox(this.materialList6, type)
				} else if (this.material_type == 6) {
					this.setCheckedBox(this.materialList7, type)
				} else if (this.material_type == 7) {
					this.setCheckedBox(this.materialList5, type)
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
			// 重置批量选择
			//图文、图片、音频等tab栏切换
			callback (key) {
				if (this.material_type == key) {
					return false
				}
				this.material_type = key;
				this.name = ''
				this.isRadar = 0
				this.isLoading = true;
				this.materialList = []
				this.clickIndex = -1
				clearInterval(this.t1)
				this.getMaterial(1, 15);
			},
			// 搜索按钮
			onSearch () {
				if (this.clickIndex != -1) {
					this.$refs.audio[this.clickIndex].pause();
					clearInterval(this.t1)
					this.clickIndex = -1
				}
				this.materialList = []
				let params = this.getPageAndPageSize()
				this.getMaterial(params.page, params.pageSize);
			},
			// 清空按钮
			clearInput () {
				if (this.clickIndex != -1) {
					this.$refs.audio[this.clickIndex].pause();
					clearInterval(this.t1)
					this.clickIndex = -1
				}
				this.name = "";
				this.isRadar = 0
				this.materialList = []
				let params = this.getPageAndPageSize1()
				this.getMaterial(params.page, params.pageSize);
			},
			clearSelectByType (type) {
				this.selectedRowKeys[type] = []
				this.selectedList[type] = []
				this.setBox(type)
			},
			// 切换分组重置page和pageSize
			getPageAndPageSize3 () {
				let params = {
					page    : 1,
					pageSize: 15
				}
				this.page = 1
				this.pageSize = 15
				this.sketchPage = 1
				this.sketchPageSize = 15
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
				} else if (this.material_type == 3) {
					params.page = this.page4
					params.pageSize = this.pageSize4
				} else if (this.material_type == 4) {
					params.page = this.sketchPage
					params.pageSize = this.sketchPageSize
				} else if (this.material_type == 7) {
					if (this.materialList5.length == 1 && this.page5 > 1) {
						this.page5 -= 1
					}
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
			// 不同类型重置page和pageSize
			getPageAndPageSize () {
				let params = {}
				if (this.material_type == 1) {
					this.page = 1
					this.pageSize = 15
					params.page = this.page
					params.pageSize = this.pageSize
				} else if (this.material_type == 3) {
					this.page4 = 1
					this.pageSize4 = 15
					params.page = this.page4
					params.pageSize = this.pageSize4
				} else if (this.material_type == 4) {
					this.sketchPage = 1
					this.sketchPageSize = 15
					params.page = this.sketchPage
					params.pageSize = this.sketchPageSize
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
					is_radar : this.isRadar,
					news_type: 1,
					page     : page,
					pageSize : pageSize,
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					if (this.material_type == 4) {
						this.materialListTotal = parseInt(res.data.count)
						this.sketchPage = page
						this.sketchPageSize = pageSize
						this.materialList = [...res.data.attachment.single.list, ...res.data.attachment.double.list]
						this.setCheckedBox(this.materialList, this.material_type)
					} else if (this.material_type == 1) {
						this.materialList2 = res.data.attachment;
						this.setCheckedBox(this.materialList2, this.material_type)
						this.total = parseInt(res.data.count);
						this.quickJumper = this.total > this.pageSize;
						this.page = page
						this.pageSize = pageSize
					} else if (this.material_type == 3) {
						this.total4 = parseInt(res.data.count);
						this.materialList4 = res.data.attachment;
						this.setCheckedBox(this.materialList4, this.material_type)
						if (this.total4 != 0) {
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
					} else if (this.material_type == 5) {
						this.total6 = parseInt(res.data.count);
						this.materialList6 = res.data.attachment;
						this.setCheckedBox(this.materialList6, this.material_type)
						this.quickJumper6 = this.total6 > this.pageSize;
						this.page6 = page
						this.pageSize6 = pageSize
					} else if (this.material_type == 6) {
						this.total7 = parseInt(res.data.count);
						this.quickJumper7 = this.total7 > this.pageSize;
						this.materialList7 = res.data.attachment;

						this.page7 = page
						this.pageSize7 = pageSize
						this.setCheckedBox(this.materialList7, this.material_type)
					} else if (this.material_type == 7) {
						this.total5 = parseInt(res.data.count);
						this.materialList5 = res.data.attachment;
						this.setCheckedBox(this.materialList5, this.material_type)
						this.quickJumper5 = this.total5 > this.pageSize;
						this.page5 = page
						this.pageSize5 = pageSize
					}
					this.isLoading = false;
				}
			},
			// 设置列表卡片多选框选中状态
			setCheckedBox (materialList, type) {
				this.checkBoxValue = new Array(materialList.length)
				this.checkBoxValue.fill(false)
				for (let i = 0; i < materialList.length; i++) {
					for (let j = 0; j < this.selectedRowKeys[type].length; j++) {
						if (materialList[i].key == this.selectedRowKeys[type][j]) {
							this.checkBoxValue[i] = true
						}
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
			// 预览图片的弹窗隐藏
			handleCancel2 () {
				this.previewVisible = false;
			},
			// 图片分页
			changePage (page, pageSize) {
				this.getMaterial(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.getMaterial(1, pageSize);
			},
			//音频分页
			changePage3 (page3, pageSize3) {
				clearInterval(this.t1)
				this.clickIndex = -1
				this.getMaterial(page3, pageSize3);
			},
			showSizeChange3 (page3, pageSize3) {
				this.getMaterial(1, pageSize3);
			},
			// 视频分页
			changePage4 (page4, pageSize4) {
				this.getMaterial(page4, pageSize4);
				this.$nextTick(() => {
					document.getElementsByClassName('scroll')[0].scrollTo(0, 220)
				})
			},
			showSizeChange4 (page4, pageSize4) {
				this.getMaterial(1, pageSize4);
			},
			changePage5 (page5, pageSize5) {
				this.getMaterial(page5, pageSize5);
			},
			showSizeChange5 (page5, pageSize5) {
				this.getMaterial(1, pageSize5);
			},
			changePage6 (page6, pageSize6) {
				this.getMaterial(page6, pageSize6);
			},
			showSizeChange6 (page6, pageSize6) {
				this.getMaterial(1, pageSize6);
			},
			changePage7 (page7, pageSize7) {
				this.getMaterial(page7, pageSize7);
			},
			showSizeChange7 (page7, pageSize7) {
				this.getMaterial(1, pageSize7);
			},
			moment,
			// 图文列表分页
			changeSketchPage (page, pageSize) {
				this.getMaterial(page, this.sketchPageSize)
			},
			showSketchSizeChange (page, pageSize) {
				this.getMaterial(this.sketchPage, pageSize)
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
			}
		},
	};
</script>

<style lang='less' scoped>
	@import '../../style/_style.less';
	@import "../../style/default.css";

	/deep/ .inputTitle2 {
		padding: 9px;
		font-size: 13px;
		height: 85px;

		p {
			word-break: break-word;
			width: 100%;
			overflow: hidden;
			text-overflow: -o-ellipsis-lastline;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-clamp: 3;
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
		min-width: 615px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}

	/deep/ .ant-card-head {
		padding: 0 6px;
		border-bottom: 0;
		min-height: 25px;
	}

	/deep/ .ant-card-meta-title {
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	#components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		flex: 0 0 200px !important;
		max-width: 200px !important;
		min-width: 200px !important;
		width: 200px !important;
		border-right: 1px solid #E2E2E2;
	}

	#components-layout-demo-basic .ant-layout-content {
		margin: 0 10px 20px;
		width: 100%;
		padding-right: 20px;
	}

	.content-hd {
		width: 100%;
		min-width: 615px;
		padding: 0 20px;
		margin: 0 0 35px 0;
		text-align: left;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		/* border: 1px solid #E2E2E2; */
		min-width: 615px;
		width: 100%;
		margin-top: 30px;
		padding-bottom: 1px;
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
		height: 500px;
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
		background: #1E90FF;
		color: white;
	}

	/deep/ .ant-card-cover img {
		width: 100%;
		height: 97px;
		display: block;
		margin: auto;
	}

	/deep/ .ant-card-body {
		padding: -1px 0 9px 0 !important;
		width: 100%;
		margin: 0 auto;
	}

	/deep/ .ant-card-head-title {
		color: #999;
		padding: 1px 0;
	}

	/deep/ .ant-tabs-tabpane {
		display: flex;
		flex-wrap: wrap;
	}

	.oddCard {
		width: 115px;
		margin: 0 4px 10px 4px;
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
		margin: 0 4px 10px 4px;
		display: inline-block;
		width: 146px;
	}

	.videoCard {
		margin: 0 4px 10px 4px;
		display: inline-block;
		width: 196px;
	}

	.wordCard {
		margin: 0 4px 10px 4px;
		display: inline-flex;
		width: 196px;
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
		color: #1890FF;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.content-msg1 a:visited {
		color: #1890FF;
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
		float: left;
		width: calc(100% - 90px);
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 3;
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
		border: 2px solid #1890FF !important;
	}

	.active1 {
		color: #1890FF;
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
		width: 17px;
		height: 17px;
	}

	/deep/ .ant-checkbox-inner:after {
		width: 5px;
		height: 8px;
		transform: rotate(40deg) scale(1) translate(-44%, -69%);
	}

	/deep/ .ant-checkbox-indeterminate .ant-checkbox-inner::after {
		width: 12px;
		height: 12px;
		transform: scale(1) translate(-50%, -50%);
	}

	.sketch-type-activity {
		color: #1890FF;
	}

	.content_input {
		background: #F1F3F5;
		min-width: 378px;
		height: 100px;
		margin-top: 5px;
		display: flex;
	}

	.input_text1 {
		width: 200px;
		line-height: 30px;
		margin: 15px 0 5px 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
		font-size: 18px;
		color: #000
	}

	.input_text2 {
		width: 250px;
		line-height: 20px;
		margin: 0 0 0 15px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		word-break: break-all;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.input_img {
		width: 80px;
		height: 80px;
	}
</style>