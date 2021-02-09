<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-layout style="position: relative;">
				<!-- 左侧 -->
				<a-layout-sider>
					<!-- 公众号 -->
					<div class="sider-one">
						<div class="sider-one-txt">选择公众号</div>
						<a-select
								showSearch
								optionFilterProp="children"
								style="width: 200px;margin-bottom: 20px;"
								@change="handleChange"
								v-model="changeBackground"
								v-if="wxInfo[0]"
						>
							<template v-for="item in wxInfo">
								<a-select-option :value="item.wx_id">{{item.nick_name}}</a-select-option>
							</template>
						</a-select>
						<div class="wx-info" style="position: absolute;" ref="wxInfo" @mousemove="wxInfoMouseOver"
						     @mouseout="wxInfoMouseOut">
							<template v-for="(item,index) in wxInfo">
								<div
										@click="selectWx(item.wx_id,item.authorizer_type,item.nick_name,item.verify_type)"
										class="selectWx"
										:class="{ active:changeBackground == item.wx_id}"
								>
									<a-avatar :src="item.head_img" shape="square"/>
									{{item.nick_name}}
								</div>
							</template>
						</div>
					</div>
				</a-layout-sider>
				<a-layout
						style="position: absolute;left:250px;top:0;bottom:0;right:0;"
						class="fans-content"
				>
					<!-- 头部 -->
					<a-layout-header>
						<label style="font-size: 16px;">素材库管理</label>
					</a-layout-header>
					<!-- 内容 -->
					<a-layout-content>
						<!-- 表格部分 -->
						<div class="content-bd">
							<div class="account-filter">
								<div class="account-filter-contain">
									<div class="account-filter-item" @click="callback (1)"
									     :class="material_type == 1?'active':''"
									     style="min-width: 20px;border-left: 0px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											图文
										</p>
									</div>
									<div class="account-filter-item" @click="callback (2)"
									     :class="material_type == 2?'active':''"
									     style="min-width: 20px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											图片
										</p>
									</div>
									<div class="account-filter-item" @click="callback (3)"
									     :class="material_type == 3?'active':''"
									     style="min-width: 20px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											音频
										</p>
									</div>
									<div class="account-filter-item" @click="callback (4)"
									     :class="material_type == 4?'active':''"
									     style="min-width: 20px;">
										<p style="width: 120px;margin: 0px;text-align: center;">
											视频
										</p>
									</div>
								</div>
							</div>
							<div class="content-msg">
								<p style="margin-bottom: 2px;">
									1、可上传永久和临时图片素材，只有永久图片上传后，可自动同步到微信后台。最多可上传5000张。</p>
								<p style="margin-bottom: 2px;">
									2、临时图片素材，有效期3天。从创建完那时起，开始算3天，精确到秒。失效后，但不影响客户在关注回复、收到消息回复、高级群发等功能中选择已失效的临时图片进行正常发送。</p>
								<p style="margin-bottom: 0px;">
									3、在本系统里删除素材的同时，也同步将微信公平台素材库删除了。反之，在微信公平台素材库删除的素材，本系统不删除，可以手动更新同步微信素材库。</p>
							</div>
							<a-spin tip="Loading..." size="large" :spinning="isLoading">
								<!--								<a-tabs :defaultActiveKey="material_type" @change="callback">-->
								<!--									<a-tab-pane tab="图文" key="1">-->
								<div v-show="material_type == 1">
									<div class="content-hd">
										<div style="text-align: right;">
											<span v-show="lastTime==''?false:true">最后同步时间：{{lastTime}}</span>
											<a-popconfirm
													title="24小时之内只能同步一次"
													@confirm="confirm"
													@cancel="cancelConfirm"
													:visible="confirmVisible"
													okText="确认"
													cancelText="取消"
													v-if="$store.state.authorizer_type != 'unauthorized' && verify_service"
											>
												<a-button
														icon="reload"
														:loading="loading1"
														style="margin-left: 10px;"
														@click="showPop"
												>同步微信素材库
												</a-button>
											</a-popconfirm>
											<a-button icon="reload" style="margin-left: 10px;"
											          @click="showConfirmWx"
											          v-if="$store.state.authorizer_type == 'unauthorized'">
												同步微信素材库
											</a-button>
											<a-button icon="reload" style="margin-left: 10px;"
											          @click="showVerify"
											          v-if="$store.state.authorizer_type != 'unauthorized' && !verify_service">
												同步微信素材库
											</a-button>
										</div>
									</div>
									<div
											style="margin: 100px;height: 400px;text-align: center;"
											v-show="materialListTotal == 0?true:false"
									>
										<img
												src="../../assets/null.png"
												style="width: 150px;display: block;margin: auto"
										/>
										<p style="text-align: center;">暂无数据</p>
									</div>
									<waterfall
											:col="col"
											:width="itemWidth"
											:data="materialList"
											@loadmore="loadmore"
											@scroll="scroll"
											:gutterWidth="gutterWidth"
											v-if="materialListTotal !== 0">
										<template>
											<div class="evenCard"
											     v-for="(item,index) in materialList">
												<!--单图文-->
												<a-card
														v-if="item.artList.length == 1"
														hoverable
														style="width: 90%;margin:auto;"
														:title="item.create_time"
												>
													<img
															alt="example"
															:src="commonUrl+item.artList[0].local_path"
															slot="cover"
													/>
													<template class="ant-card-actions" slot="actions">
														<a-button type="link" @click="phoneView(item.id)">
															<a-icon type="eye"/>
															手机预览
														</a-button>
														<a-button type="link" @click="delPicTxt(item.id)">
															<a-icon type="delete"/>
															删除
														</a-button>
													</template>
													<div
															style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -47px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
													>{{item.artList[0].title}}
													</div>
												</a-card>
												<!--多图文-->
												<a-card
														v-if="item.artList.length != 1"
														hoverable
														style="width: 90%; margin: auto;"
														:title="item.create_time"
												>
													<template v-for="(art, artIndex) in item.artList">
														<template v-if="artIndex == 0">
															<div
																	style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -47px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
															>{{art.title}}
															</div>
															<img
																	alt="example"
																	:src="commonUrl+art.local_path"
																	slot="cover"
															/>
														</template>
														<template v-if="artIndex != 0">
															<a-card-meta :title="art.title">
																<a-avatar
																		slot="avatar"
																		shape="square"
																		:size="64"
																		:src="commonUrl+art.local_path"
																/>
															</a-card-meta>
														</template>
													</template>
													<template class="ant-card-actions" slot="actions">
														<a-button type="link" @click="phoneView(item.id)">
															<a-icon type="eye"/>
															手机预览
														</a-button>
														<a-button type="link" @click="delPicTxt(item.id)">
															<a-icon type="delete"/>
															删除
														</a-button>
													</template>
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
								<div style="height: auto;" v-show="material_type == 2">
									<div class="content-hd">
										<div style="overflow: hidden;margin-bottom: 35px;">
											<div style="float: left;">
												<a-input-search
														placeholder="输入要搜索的内容"
														@search="onSearch"
														v-model="picTitle"
														:allowClear=true
														enterButton="搜索"
														style="width: 220px;"
												/>
												<a-button @click="clearInput" style="margin-left: 10px;">
													清空
												</a-button>
												<a-button type="primary" @click="showModal" style="margin-left: 10px;">
													<a-icon type="upload"/>
													上传图片
												</a-button>
											</div>
											<!-- 上传图片弹窗 -->
											<a-modal v-model="visible2" title="新建图片素材" @cancel="cancelUploadPic">
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
												<a-radio-group name="radioGroup" v-model="defaultValue">
													<label>素材类型：</label>
													<a-radio :value="1">永久素材</a-radio>
													<a-radio :value="0">临时素材</a-radio>
												</a-radio-group>
												<p style="margin-top: 1em;">
													上传图片：
													<a-upload
															name="avatar"
															listType="picture-card"
															class="avatar-uploader"
															:showUploadList="false"
															action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
															:beforeUpload="beforeUpload"
															:customRequest="selfUpload"
													>
														<img v-if="imageUrl" :src="imageUrl" alt="avatar"
														     style="max-width:100%;max-height:100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);"/>
														<div v-else style="padding-top: 25px;">
															<a-icon type="plus"/>
															<div class="ant-upload-text">点击上传</div>
														</div>
													</a-upload>
													<span style="color: #AAA;font-size: 12px;display: inline-block;vertical-align: bottom;">（图片建议尺寸：900像素*500像素）</span>
												</p>

											</a-modal>
											<div style="float: right;">
												<span v-show="lastTime?true:false">最后同步时间：{{lastTime}}</span>
												<a-popconfirm
														title="24小时之内只能同步一次"
														@confirm="confirm"
														@cancel="cancelConfirm"
														:visible="confirmVisible"
														okText="确认"
														cancelText="取消"
														v-if="$store.state.authorizer_type != 'unauthorized' && verify_service"
												>
													<a-button
															icon="reload"
															:loading="loading1"
															style="margin-left: 10px;"
															@click="showPop"
													>同步微信素材库
													</a-button>
												</a-popconfirm>
												<a-button icon="reload" style="margin-left: 10px;"
												          @click="showConfirmWx"
												          v-if="$store.state.authorizer_type == 'unauthorized'">
													同步微信素材库
												</a-button>
												<a-button icon="reload" style="margin-left: 10px;"
												          @click="showVerify"
												          v-if="$store.state.authorizer_type != 'unauthorized' && !verify_service">
													同步微信素材库
												</a-button>
											</div>
										</div>

										<div
												style="margin: 100px;height: 400px;text-align: center;"
												v-show="materialList2 == ''?true:false"
										>
											<img
													src="../../assets/null.png"
													style="width: 150px;display: block;margin: auto;"
											/>
											<p style="text-align: center;">暂无数据</p>
										</div>
										<div class="oddCard" v-for="(item2,index) in materialList2" :key="item2.id">
											<a-card
													hoverable
													style="width: 90%;margin:auto;"
													:title="item2.create_time"
											>
												<img
														alt="example"
														:src="commonUrl+item2.local_path"
														slot="cover"
														@click="previewPic(index)"
												/>
												<template class="ant-card-actions" slot="actions">
													<a-button type="link" @click="previewPic(index)">
														<a-icon type="eye"/>
														预览
													</a-button>
													<a-button type="link" @click="delPic(item2.id)">
														<a-icon type="delete"/>
														删除
													</a-button>
												</template>
												<div
														style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -47px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
												>{{item2.file_name}}
												</div>
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

												<div v-for="(preview, key) in materialList2" style="width: 840px!important;height: 600px;position: relative;">
													<img
															alt=""
															:src="commonUrl + preview.local_path"
															style="max-width:100%;max-height:100%;transform: translate(-50%, -50%);position:absolute;top: 50%;left: 50%;"
													/>
												</div>
											</a-carousel>
										</a-modal>

									</div>

									<!-- 图片分页 -->
									<div style="width: 100%;padding: 0 20px 20px;" v-show="total>0">
										<div style="height: 32px;display: inline-block;line-height: 32px;">
											共有
											<span style="color: blue">{{total}}</span>个素材
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
								<!--									</a-tab-pane>-->
								<!--									<a-tab-pane tab="音频" key="3">-->
								<div v-show="material_type == 3">
									<div class="content-hd">
										<div style="margin-bottom: 20px;text-align: right;">
											<span v-show="lastTime?true:false">最后同步时间：{{lastTime}}</span>
											<a-popconfirm
													title="24小时之内只能同步一次"
													@confirm="confirm"
													@cancel="cancelConfirm"
													:visible="confirmVisible"
													okText="确认"
													cancelText="取消"
													v-if="$store.state.authorizer_type != 'unauthorized' && verify_service"
											>
												<a-button
														icon="reload"
														:loading="loading1"
														style="margin-left: 10px;"
														@click="showPop"
												>同步微信素材库
												</a-button>
											</a-popconfirm>
											<a-button icon="reload" style="margin-left: 10px;"
											          @click="showConfirmWx"
											          v-if="$store.state.authorizer_type == 'unauthorized'">
												同步微信素材库
											</a-button>
											<a-button icon="reload" style="margin-left: 10px;"
											          @click="showVerify"
											          v-if="$store.state.authorizer_type != 'unauthorized' && !verify_service">
												同步微信素材库
											</a-button>
										</div>
									</div>
									<div style="height: 400px; text-align: center;margin: 100px;"
									     v-show="materialList3 == ''?true:false">
										<img
												src="../../assets/null.png"
												style="width: 150px;display: block;margin: auto;"
										/>
										<p style="text-align: center;">暂无数据</p>
									</div>
									<div class="oddCard" v-for="(item3,index3) in materialList3" :key="item3.id">
										<a-card hoverable style="width: 90%;margin:auto;">
											<div
													style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
											>{{item3.file_name}}
											</div>
											<div class="audio">
												<div class="box" @click="playMusic(index3)"
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
												<div class="box" v-show="clickIndex == index3">
													<div class="wifi-symbol">
														<div class="wifi-circle first"></div>
														<div class="wifi-circle second1"></div>
														<div class="wifi-circle third1"></div>
													</div>
												</div>

											</div>
											<div
													style="text-align: right;padding: 0 5px;"
											>{{playTime[index3] | dateFormat}}
											</div>
											<template class="ant-card-actions" slot="actions">
												<a-button type="link" @click="delAudio(item3.id)">
													<a-icon type="delete"/>
													删除
												</a-button>
											</template>
											<div style="color: #999;font-size: 16px;">{{item3.create_time}}</div>
										</a-card>
									</div>
									<!-- 音频分页 -->
									<div style="width: 100%;padding: 0 20px 20px;" v-if="total3>0">
										<div style="height: 32px;display: inline-block;line-height: 32px;">
											共有
											<span style="color: blue">{{total3}}</span>个素材
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
								<!--									</a-tab-pane>-->
								<!--									<a-tab-pane tab="视频" key="4">-->
								<div v-show="material_type == 4">
									<div class="content-hd">
										<div style="margin-bottom: 20px;text-align: right;">
											<span v-show="lastTime?true:false">最后同步时间：{{lastTime}}</span>
											<a-popconfirm
													title="24小时之内只能同步一次"
													@confirm="confirm"
													@cancel="cancelConfirm"
													:visible="confirmVisible"
													okText="确认"
													cancelText="取消"
													v-if="$store.state.authorizer_type != 'unauthorized' && verify_service"
											>
												<a-button
														icon="reload"
														:loading="loading1"
														style="margin-left: 10px;"
														@click="showPop"
												>同步微信素材库
												</a-button>
											</a-popconfirm>
											<a-button icon="reload" style="margin-left: 10px;"
											          @click="showConfirmWx"
											          v-if="$store.state.authorizer_type == 'unauthorized'">
												同步微信素材库
											</a-button>
											<a-button icon="reload" style="margin-left: 10px;"
											          @click="showVerify"
											          v-if="$store.state.authorizer_type != 'unauthorized' && !verify_service">
												同步微信素材库
											</a-button>
										</div>
									</div>
									<div style="height: 400px;text-align: center;margin: 100px;"
									     v-show="materialList4 == ''?true:false">
										<img
												src="../../assets/null.png"
												style="width: 150px;display: block;margin: auto;"
										/>
										<p style="text-align: center;">暂无数据</p>
									</div>
									<div class="oddCard" v-for="(item4,index4) in materialList4" :key="item4.id">
										<a-card hoverable style="width: 90%;margin:auto;"
										        :title="item4.create_time">
											<video-player
													class="video-player vjs-custom-skin"
													ref="videoPlayer"
													:playsinline="true"
													:options="playerOptions[index4]"
											></video-player>
											<template class="ant-card-actions" slot="actions">
												<a-button type="link" @click="delVideo(item4.id)">
													<a-icon type="delete"/>
													删除
												</a-button>
											</template>
											<div
													style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
											>{{item4.file_name}}
											</div>
										</a-card>
									</div>
									<!-- 视频分页 -->
									<div style="width: 100%;padding: 0 20px 20px;" v-if="total4>0">
										<div style="height: 32px;line-height: 32px;display: inline-block;">
											共有
											<span style="color: blue">{{total4}}</span>个素材
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
								<!--									</a-tab-pane>-->
								<!--								</a-tabs>-->
							</a-spin>
						</div>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";
	import {videoPlayer} from "vue-video-player";
	import "video.js/dist/video-js.css";

	function getBase64 (img, callback) {
		const reader = new FileReader();
		reader.addEventListener("load", () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	export default {
		components: {
			videoPlayer
		},
		data () {
			let changeBackground =
				localStorage.getItem('wxNum') ? localStorage.getItem('wxNum') : "";
			return {
				isLoading        : true, //Loading 组件显示与隐藏
				wxInfo           : [], //微信公众号列表
				changeBackground : changeBackground, //选中背景色
				loading1         : false, //同步按钮加载显示与隐藏
				materialList     : [],//图文素材列表
				materialListTotal: 0, //图文素材列表总条数
				single           : [], //单图文列表
				double           : [], //多图文列表
				materialList2    : [], //图片素材列表
				materialList3    : [], //视频素材列表
				materialList4    : [], //音频素材列表
				material_type    : 1, //1图文，2图片，3音频，4视频
				lastTime         : "", //最后同步时间
				visible          : false, //手机预览弹窗显示与隐藏
				loading3         : false, //手机预览确定按钮加载显示与隐藏
				inputUsername    : "", //手机预览输入的微信号
				materialId       : "", //素材id
				visible2         : false, //上传图片弹窗显示与隐藏
				loading4         : false, //上传图片弹窗加载显示与隐藏
				//上传图片
				imageUrl         : "",
				defaultValue     : 1, //默认上传素材类型，1为永久，0为临时
				fileInfo         : {}, //上传图片的文件信息
				previewVisible   : false, //预览图片的弹窗显示与隐藏
				previewUrl       : this.$store.state.commonUrl + "/upload/previw.png", //预览图片地址
				picTitle         : "", //图片标题
				page             : 1, //页数
				pageSize         : 15, //每页个数
				total            : 0, //总条数
				quickJumper      : false, // 是否显示快速跳转的控件
				page3            : 1, //多图文素材页数
				pageSize3        : 15, //多图文素材每页个数
				total3           : 0, //多图文素材总条数
				quickJumper3     : false, //多图文素材是否显示快速跳转的控件
				page4            : 1, //多图文素材页数
				pageSize4        : 15, //多图文素材每页个数
				total4           : 0, //多图文素材总条数
				quickJumper4     : false, //多图文素材是否显示快速跳转的控件
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
				playTime         : [], //音频播放时间
				clickIndex       : -1, //点击的音频序号，控制喇叭的显示与隐藏
				commonUrl        : this.$store.state.commonUrl,//公共的链接
				col              : 4,//图文瀑布流分几列
				verify_service   : false,//判断选中的公众号是否是已认证
				confirmVisible   : false,//同步微信素材库按钮气泡确认框的显示与隐藏
				is_pull          : 0,//检查24小时内是否能同步，0同步，1检查
			};
		},

		methods: {
			wxInfoMouseOver () {
				this.$refs.wxInfo.style.overflowY = "auto";
			},
			wxInfoMouseOut () {
				this.$refs.wxInfo.style.overflowY = "hidden";
			},
			// 公众号
			handleChange (value) {
				this.verify_service = false
				// TODO
				this.wxInfo.map((x) => {
					if (value == x.wx_id) {
						this.$store.commit("changeAuthorizerType", x.authorizer_type);
						this.$store.commit("changeWxNickName", x.nick_name);
						if (x.verify_type == '已认证') {
							this.verify_service = true
						}
					}
				})
				this.$store.dispatch("changeWxNum", value);
				this.isLoading = true;
				this.changeBackground = value;
				this.getMaterial();
				if(localStorage.getItem('isMasterAccount') == 2){
					this.$store.dispatch('getPermissionButton')
				}
			},
			selectWx (id, authorizer_type, nick_name, verify_type) {
				this.verify_service = false
				this.$store.dispatch("changeWxNum", id);
				this.isLoading = true;
				this.changeBackground = id;
				if (verify_type == '已认证') {
					this.verify_service = true
				}
				this.$store.commit("changeAuthorizerType", authorizer_type);
				this.$store.commit("changeWxNickName", nick_name);
				this.getMaterial();
				if(localStorage.getItem('isMasterAccount') == 2){
					this.$store.dispatch('getPermissionButton')
				}
			},
			showConfirmWx () {
				this.$success({
					title: this.$store.state.wxNickName + '已取消授权，无法操作',
				});
			},
			showVerify () {
				this.$success({
					title: '仅针对认证的服务号开放使用',
				});
			},
			//tab栏切换
			callback (key) {
				this.material_type = key;
				this.getMaterial();
				this.isLoading = true;
			},
			//搜索框
			onSearch (value) {
				this.picTitle = value;
				this.getMaterial();
			},
			clearInput () {
				this.picTitle = "";
				this.getMaterial();
			},

			//手机预览
			phoneView (id) {
				this.materialId = id;
				this.visible = true;
			},
			handleOk (e) {
				this.loading3 = true;
				this.phonePreview();
			},
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
				const {data: res} = await this.axios.post("material/delete", {
					material_id: id
				});
				// console.log(res)
				if (res.error != 0) {
					that.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.$message.success("删除成功");
					this.getMaterial();
				}
			},
			//同步按钮
			showPop () {
				// this.confirmVisible = true
				this.is_pull = 1
				this.loading1 = true;
				this.refreshMaterial()
			},
			cancelConfirm () {
				this.confirmVisible = false
			},
			confirm () {
				this.loading1 = true;
				this.isLoading = true
				this.is_pull = 0
				this.refreshMaterial()
				message.info("已进入后台刷新中，请耐心等待...")
			},
			async refreshMaterial () {
				const {data: res} = await this.axios.post("material/get-batch", {
					material_type: this.material_type,
					is_pull      : this.is_pull
				});
				// console.log(res)
				if (res.error != 0) {
					this.loading1 = false;
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					if (this.is_pull == 1) {
						this.confirmVisible = true
						this.loading1 = false;
					} else {
						message.success("同步微信素材库已经进入队列")
						this.getMaterial();
						this.confirmVisible = false
					}
				}
			},
			//获取素材列表
			async getMaterial (page = 1, pageSize = this.pageSize) {
				// TODO
				this.wxInfo = this.$store.state.wxArr;
				// console.log(this.$store.state.wxArr)
				const {data: res} = await this.axios.post("material/list", {
					material_type: this.material_type,
					title        : this.picTitle,
					page         : page,
					pageSize     : pageSize,
					news_type    : ''
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.loading1 = false;
					this.$message.error(res.error_msg);
				} else {
					if (this.material_type == 1) {
						// console.log(res, 'res')
						this.materialListTotal = parseInt(res.data.count)
						this.lastTime = res.data.pull_time;
						this.isLoading = false;
						this.single = res.data.material.single;
						this.double = res.data.material.double;
						this.materialList = [...this.single.list, ...this.double.list]
						this.loading1 = false;
						// console.log(this.materialList, 'this.materialList')
					} else if (this.material_type == 2) {
						this.isLoading = false;
						this.lastTime = res.data.pull_time;
						this.materialList2 = res.data.material;
						this.total = parseInt(res.data.count);
						this.page = page;
						this.pageSize = pageSize;
						this.quickJumper = this.total > this.pageSize;
						this.loading1 = false;
					} else if (this.material_type == 3) {
						this.isLoading = false;
						this.loading1 = false;
						this.materialList3 = res.data.material;
						this.lastTime = res.data.pull_time;
						// console.log(this.materialList3, 'audio')
						this.total3 = parseInt(res.data.count);
						this.page3 = page;
						this.pageSize3 = pageSize;
						this.quickJumper3 = this.total3 > this.pageSize;
					} else if (this.material_type == 4) {
						this.isLoading = false;
						this.loading1 = false;
						this.materialList4 = res.data.material;
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
						// console.log(this.materialList4, 'video')
						this.total4 = parseInt(res.data.count);
						this.page4 = page;
						this.pageSize4 = pageSize;
						this.quickJumper4 = this.total4 > this.pageSize;
					}
				}
			},
			//图片按钮
			previewPic (index) {
				this.previewVisible = true;
				this.$nextTick(() => {
					// 默认显示当前选中的资源
					this.$refs.previewCarousel.goTo(index, false);
				});
			},
			handleCancel2 () {
				this.previewVisible = false;
			},
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
			//上传图片
			showModal () {
				this.fileInfo = {}
				this.imageUrl = ''
				this.visible2 = true;
			},
			uploadPic () {
				this.loading4 = true;
				this.uploadPic2();
			},
			cancelUploadPic () {
				this.visible2 = false;
				this.defaultValue = 1;
				this.imageUrl = "";
			},
			selfUpload ({action, file, onSuccess, onError, onProgress}) {
				const base64 = new Promise(resolve => {
					const fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					fileReader.onload = () => {
						resolve(fileReader.result);
						this.imageUrl = fileReader.result;
						this.canClick = false;
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
				}
				return isLt2M;
			},
			async uploadPic2 () {
				let param = new FormData();
				param.append("wx_id", this.$store.state.wxNum);
				param.append("type", this.defaultValue);
				param.append("fileInfo", this.fileInfo);
				const {data: res} = await this.axios.post("material/add-pic", param);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.loading4 = false;
				} else {
					this.getMaterial();
					this.$message.success("上传成功");
					this.visible2 = false;
					this.loading4 = false;
					this.imageUrl = "";
					this.defaultValue = 1;
				}
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
				this.getMaterial(page3, pageSize3);
			},
			showSizeChange3 (page3, pageSize3) {
				this.getMaterial(1, pageSize3);
			},
			// 视频分页
			changePage4 (page4, pageSize4) {
				this.getMaterial(page4, pageSize4);
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
			//播放音频
			playMusic (index) {
				this.$refs.audio[index].play();
				this.clickIndex = index;
				let time = this.playTime[index];
				var t1 = setInterval(() => {
					// console.log(this.$refs.audio[index].paused);
					if (this.$refs.audio[index].paused) {
						clearInterval(t1);
						this.clickIndex = -1;
					}
				}, 1000);
				var t2 = setInterval(() => {
					time--;
					this.$set(this.playTime, index, time);
					if (time <= 0) {
						clearInterval(t2);
						this.$set(
							this.playTime,
							index,
							Math.ceil(this.$refs.audio[index].duration)
						);
					}
				}, 1000);
			},
			oncanplay (res) {
				//   console.log(res.target.duration);
				const audioIndex = res.target.dataset.index;
				this.$set(this.playTime, audioIndex, Math.ceil(res.target.duration));
			},
			scroll (scrollData) {
				console.log(scrollData)
			},
			loadmore (e) {
				console.log(e,333)
			},
		},

		computed: {
			itemWidth () {
				//（外层盒子最小宽度885px-滚动条宽度4px-每列间距10*3）/ 4列
				return (212.75 * (document.getElementsByClassName("content-hd")[0].clientWidth / 885))
			},
			gutterWidth () {
				return (10 * (document.getElementsByClassName("content-hd")[0].clientWidth / 885));
			},
		},

		created () {
			this.$store.dispatch('getWx', (info) => {
				this.wxInfo = info;
				if (!this.changeBackground && this.wxInfo.length > 0) {
					this.changeBackground = this.$store.state.wxNum;
				}
				this.wxInfo.map((x) => {
					if (x.wx_id == this.changeBackground) {
						if (x.verify_type == '已认证') {
							this.verify_service = true
						}
					}
				})
			});
			// console.log(this.$store.state,66666)
			this.getMaterial();
		},
		mounted () {
		}
	};
</script>

<style lang='less' scoped>
	@import '../../style/_style.less';

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
		margin: 30px 0 35px 0;
		text-align: left;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		/* border: 1px solid #E2E2E2; */
		min-width: 885px;
		width: 100%;
		margin-top: 30px;
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

	.selectWx {
		width: 200px;
		margin-left: 20px;
		height: 50px;
		line-height: 50px;
		cursor: pointer;
		padding-left: 10px;
	}

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
		padding: 16px 15px 9px 15px !important;
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
		margin: 0 0 35px 0;
		border-bottom: 1px solid #DDD;
	}

	/deep/ .ant-card-hoverable:hover {
		box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.15) !important;
	}

	.phoneView-txt {
		width: 100%;
		background: #FFF2DB;
		border: 1px solid #FFDDA6;
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
		width: calc(100% - 224px);
		width: -moz-calc(100% - 224px);
		width: -webkit-calc(100% - 224px);
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
		width: 190px;
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

	/deep/.vue-waterfall {
		height: 100%!important;
		overflow: hidden;
		margin-bottom: 20px;
	}
	/deep/.video-js .vjs-control {
		width: 0!important;
		/*max-width: 4em!important;*/
		min-width: 33px!important;
	}
</style>