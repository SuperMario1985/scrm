<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="加载中..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template v-if="typeof urlId == 'undefined'">新建</template>
						<template v-if="typeof urlId != 'undefined'">修改</template>
						渠道二维码
						<a-button type="primary" icon="rollback" @click="goBack" style="float: right;margin-top: 9px;">
							返回列表
						</a-button>
					</a-layout-header>
					<a-layout style class="fans-content">
						<!-- 左侧 -->
						<a-layout-sider>
							<div class="wrap">
								<img src="../../../assets/wxHeader.png" alt
								     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
								<div class="msg_content_body">
									<template v-for="(element,index) in list">
										<!-- 图文 -->
										<div v-show="element.typeValue == 5" class="mt">
											<template v-if="element.closeShowModal3">
												<div style="border: 1px solid #E8E8E8;">
													<img :src="element.sketchList[0].local_path.img"
													     style="height: 145px;width: 100%;object-fit: cover;"/>
													<div class="inputTitle"
													     v-html="element.sketchList[0].inputTitle==''?'标题':element.sketchList[0].inputTitle"></div>
													<template
															v-for="(sketch,sketchIndex) in element.sketchList.slice(1)">
														<div class="inputTitle2">
															<p v-html="element.sketchList[sketchIndex+1].inputTitle==''?'标题':element.sketchList[sketchIndex+1].inputTitle"></p>
															<img :src="element.sketchList[sketchIndex+1].local_path.img"
															     alt=""
															     style="width: 64px;height: 64px;float: right;object-fit: cover;">
														</div>
													</template>
												</div>
											</template>
										</div>
										<!-- 图片 -->
										<div v-show="element.typeValue == 2" class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;"/>
											<!-- 选中前 -->
											<template v-if="element.closeShowModal3 == false">
												<img src="../../../assets/img.png" alt
												     style="width: 150px;border-radius: 4px;"/>
											</template>
											<!-- 选中后 -->
											<template v-if="element.closeShowModal3">
												<img :src="element.local_path.img" alt
												     style="width: 150px;border-radius: 4px;object-fit: cover;"/>
											</template>
										</div>
										<!-- 文字 -->
										<div v-show="element.typeValue == 1" class="mt">
											<a-avatar
													src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
													:size="36" style="margin-right: 10px;float: left;"/>
											<span v-html="element.textAreaValueHeader"
											      class="item-info msg_content_txt"></span>
										</div>
										<!-- 音频 -->
										<div v-show="element.typeValue == 3" class="mt">
											<!-- 选中前 -->
											<template v-if="element.closeShowModal3 == false">
												<div class="audio">
													<div class="box">
														<div class="wifi-symbol">
															<div class="wifi-circle first"></div>
															<div class="wifi-circle second"></div>
															<div class="wifi-circle third"></div>
														</div>
													</div>
												</div>
											</template>
											<!-- 选中后 -->
											<template v-if="element.closeShowModal3">
												<div class="audio">
													<div style="float: left;font-size: 16px;">{{element.file_name}}
													</div>
													<div class="box">
														<div class="wifi-symbol">
															<div class="wifi-circle first"></div>
															<div class="wifi-circle second"></div>
															<div class="wifi-circle third"></div>
														</div>
													</div>
												</div>
											</template>
										</div>
										<!-- 视频 -->
										<div v-show="element.typeValue == 4" class="mt">
											<!-- 选中前 -->
											<template v-if="element.closeShowModal3 == false">
												<a-card hoverable style="width: 100%">
													<img alt="example"
													     src="http://s.weituibao.com/static/1545276720179/video.png"
													     slot="cover"/>
													<a-card-meta style="height: 50px;"></a-card-meta>
												</a-card>
											</template>
											<!-- 选中后 -->
											<template v-if="element.closeShowModal3">
												<a-card hoverable style="width: 100%">
													<video-player class="video-player vjs-custom-skin" ref="videoPlayer"
													              :playsinline="true"
													              :options="playerOptions"></video-player>
													<a-card-meta :title="element.file_name"
													             style="height: 50px;line-height: 50px;text-align: center;">
													</a-card-meta>
												</a-card>
											</template>
										</div>
									</template>
								</div>
							</div>
						</a-layout-sider>
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<!-- <a-spin tip="加载中..." size="large" :spinning="isLoading"></a-spin> -->
								<!-- 公众号选择 -->
								<div class="content-hd" v-if="$store.state.wxArr.length > 1">
									<a-form>
										<a-form-item label="选择公众号" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<template>
												<div style="display: inline-block;cursor: pointer;" @click="add">
													<a-avatar shape="square" :size="40" :src="avatarImg"
													          style="margin: 0 15px;"/>
													<span>{{$store.state.wxNickName}}</span>
													<a-icon type="caret-down"
													        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
													        v-if="typeof urlId=='undefined'"/>
												</div>
												<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
											</template>
										</a-form-item>
									</a-form>
								</div>
								<div class="content-bd">
									<a-form>
										<!-- 二维码名称 -->
										<a-form-item label="二维码名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
										             style="padding-top: 15px;">
											<a-input v-model="msg_title" placeholder="如：扫码送试用装01，限20字符" :maxLength="20"
											         style="width: 60%;"
											         :disabled="typeof urlId=='undefined'?false:true"/>
											<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{msg_title.length}} / 20</span>
											<span style="color: #F56C6C;margin-left: 20px;">（一旦创建，不可修改）</span>
										</a-form-item>
										<!-- 有效期 -->
										<a-form-item label="有效期" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<a-radio-group name="radioGroup" v-model="validity"
											               :disabled="typeof urlId=='undefined'?false:true">
												<a-radio :value="1">30天（临时码过期后失效）</a-radio>
												<a-radio :value="2">永久</a-radio>
											</a-radio-group>
											<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
										</a-form-item>
										<!-- 粉丝标签 -->
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
										<span slot="label">
									        粉丝标签&nbsp;
									        <a-tooltip title="通过该渠道二维码扫码关注公众号的粉丝，将会被自动打上选中的粉丝标签">
									          <a-icon type="question-circle"/>
									        </a-tooltip>
										</span>
											<span>
											<div class="hideMask" v-show="typeof urlId != 'undefined'"></div>
											<template v-for="(item,index) in tagsList">
												<a-checkable-tag v-model="checked[index]"
												                 @change="changeTags(item.key)">
													{{item.name}}
												</a-checkable-tag>
											</template>
											</span>
											<a-button style="font-size:13px; height: 26px"
											          @click="createTag"
											          :disabled="typeof urlId=='undefined'?false:true"
											          v-has="'tag-add'">
												新建标签
											</a-button>
											<a-modal title="新建标签" v-model="visible" @ok="handleOk(inputValue)"
											         :confirmLoading="confirmLoading3" @cancel="cancel">
												<p style="margin: 0px 0px 10px 0;font-size: 13px; color: #909399;">
													每个标签名称最多6个字。同时新建多个标签时，请用“空格”隔开</p>
												<a-input placeholder="请输入标签（不得超过6个字符）" v-model="inputValue"/>
											</a-modal>
										</a-form-item>
										<!-- 扫码推送 -->
										<a-form-item label="扫码推送" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<a-switch :checked="pushValue" @click="changeStatus"/>
											（关闭后，扫渠道码，新粉丝依然可以关注公众号，且可对该粉丝自动打标签，但仅收到【关注回复】消息）
										</a-form-item>
										<!-- 推送内容 -->
										<a-form-item label="推送内容" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
										             v-show="pushValue == 1">
											<p style="color: #F56C6C;margin: 0;line-height: 20px;padding: 10px 0px 2px 0px;">
												1，只能添加1个图文，且最多只能添加8条
											</p>
											<p style="color: #F56C6C;margin: 0;line-height: 20px;padding: 2px 0px;">
												2、因接口限制，“全部推送”仅支持首条回复多图文
											</p>
											<p style="color: #F56C6C;margin: 0;line-height: 20px;padding: 2px 0px 4px 0px;">
												3、总添加内容上限10个
											</p>
											<div class="pull-left fl">
												<vuedraggable v-model="list" :move="checkMove">
													<transition-group>
														<div class="push-type-list" :class="{active: index==current}"
														     @click="clickTab(index)" v-for="(element,index) in list"
														     :key="index">
															<div class="push-type-item">
																<span class="index">{{index+1}}</span>
																<span
																		class="type">{{element.typeName[element.typeValue]}}</span>
															</div>
														</div>
													</transition-group>
												</vuedraggable>
												<div slot="footer" class="add-new" @click="createPullLeft"
												     v-show="list.length < 10">
                                                <span class="add-icon">
                                                    <a-icon type="plus"/>
                                                </span>
													<span class="add-btn">新建</span>
												</div>
											</div>

											<div class="pull-right fl" v-for="(element,index) in list" :key="index"
											     :class="{hide: index != current}">
												<a-form>
													<!-- 消息类型 -->
													<a-form-item label="消息类型" :label-col="{ span: 3 }"
													             :wrapper-col="{ span: 21 }">
														<a-radio-group name="radioGroup" v-model="element.typeValue"
														               @change="changeTypeValue(index)">
															<a-radio :value="5" :disabled="element.disabled">
																图文
															</a-radio>
															<a-radio :value="2">图片</a-radio>
															<a-radio :value="1">文字</a-radio>
															<a-radio :value="3">音频</a-radio>
															<a-radio :value="4">视频</a-radio>
														</a-radio-group>
													</a-form-item>
													<template v-if="element.typeValue == 5"
													          v-for="(sketch,sketchIndex) in element.sketchList">
														<!-- 添加方式 -->
														<a-form-item label="添加方式" :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }">
															<a-radio-group name="radioGroup" v-model="sketch.addType"
															               @change="changeAddType(sketchIndex)">
																<a-radio :value="1">新建</a-radio>
																<a-radio :value="0">导入</a-radio>
															</a-radio-group>
														</a-form-item>
														<!-- 图文新建 -->
														<template v-if="sketch.addType == 1">
															<!-- 图片封面 -->
															<!-- 选中前 -->
															<a-form-item :label-col="{ span: 3 }"
															             :wrapper-col="{ span: 21 }"
															             v-show="sketch.closeShowModal3==false">
																<template slot="label"><span style="color: red">*</span>图片封面
																</template>
																<div class="upload-wrap"
																     @click="openShowModal(sketchIndex)">
																	<a-icon type="plus" class="upload-plus"/>
																</div>
															</a-form-item>
															<!-- 选中后 -->
															<a-form-item :label-col="{ span: 3 }"
															             :wrapper-col="{ span: 21 }"
															             v-show="sketch.closeShowModal3">
																<template slot="label"><span style="color: red">*</span>图片封面
																</template>
																<div class="upload-wrap"
																     @click="openShowModal(index,sketch.material_id)">
																	<img :src="sketch.local_path.img" alt=""
																	     class="upload-wrap-pic">
																</div>
																<span
																		style="color: blue;position: absolute;bottom: 0;left: 110px;cursor: pointer;"
																		@click="openShowModal(sketchIndex,sketch.material_id)">重新上传</span>
															</a-form-item>
															<!-- 填写标题 -->
															<a-form-item :label-col="{ span: 3 }"
															             :wrapper-col="{ span: 21 }">
																<template slot="label"><span style="color: red">*</span>填写标题
																</template>
																<a-input v-model="sketch.inputTitle" :maxLength="32">
																<span slot="suffix">
                    <span>{{sketch.inputTitle.length}}</span>/32
                  </span>
																</a-input>
															</a-form-item>
															<!-- 添加描述 -->
															<a-form-item label="添加描述" :label-col="{ span: 3 }"
															             :wrapper-col="{ span: 21 }">
																<a-textarea placeholder="填写图文描述" :rows="4"
																            style="resize: none;"
																            v-model="sketch.digest" :maxLength="128"/>
																<div style="float:right;">
																	<span>{{sketch.digest.length}}</span>/128
																</div>
															</a-form-item>
															<!-- 素材同步 -->
															<a-form-item label="素材同步" :label-col="{ span: 3 }"
															             :wrapper-col="{ span: 21 }">
																<a-radio-group @change="changeMaterialSync(sketchIndex)"
																               v-model="sketch.materialSync"
																               :disabled="sketch.disabledSync == 1 ? true : false">
																	<a-radio :value="0">不同步</a-radio>
																	<a-radio :value="1"
																	         :style="{ 'display': sketch.materialSync == 1 ? 'block' : '' }">
																		同步至【内容引擎】
																		<div v-show="sketch.materialSync == 1"
																		     style="margin-top: 10px;">
																			选择分组：
																			<a-tree-select
																					style="width: 225px"
																					:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
																					:treeData="groupList"
																					placeholder='Please select'
																					treeDefaultExpandAll
																					v-model="sketch.selectGroupId"
																			>
																			</a-tree-select>
																		</div>
																	</a-radio>
																</a-radio-group>
															</a-form-item>
															<!-- 点击跳转 -->
															<a-form-item :label-col="{ span: 3 }"
															             :wrapper-col="{ span: 21 }">
																<template slot="label"><span style="color: red">*</span>点击跳转
																</template>
																<a-input placeholder="请输入跳转链接，且必须以http://或https://开头"
																         style="margin-bottom: 10px;"
																         v-model="sketch.content_source_url"></a-input>
																<a-button type="primary" ghost
																          style="margin-right: 15px;"
																          @click="addSketch(sketchIndex)"
																          v-show="sketch.addSketchVisible">
																	<a-icon type="plus"/>
																	添加图文
																</a-button>
																<a-button @click="deleteSketch(sketchIndex,index)">删除该条
																</a-button>
															</a-form-item>
														</template>
														<!-- 图文导入 -->
														<template v-if="sketch.addType == 0">
															<!-- 选中前 -->
															<a-form-item :label-col="{ span: 3 }"
															             :wrapper-col="{ span: 21 }"
															             v-show="sketch.closeShowModal3==false">
																<template slot="label"><span style="color: red">*</span>图文
																</template>
																<div class="upload-border"
																     @click="openShowModal(sketchIndex)">
																	<a-icon type="plus" class="upload-plus"/>
																	<span>选择图文</span>
																</div>
																<a-button type="primary" ghost
																          style="margin-right: 15px;"
																          @click="addSketch(sketchIndex)"
																          v-show="sketch.addSketchVisible">
																	<a-icon type="plus"/>
																	添加图文
																</a-button>
																<a-button @click="deleteSketch(sketchIndex,index)">删除该条
																</a-button>
															</a-form-item>
															<!-- 选中后 -->
															<a-form-item :label-col="{ span: 3 }"
															             :wrapper-col="{ span: 21 }"
															             v-show="sketch.closeShowModal3">
																<template slot="label"><span style="color: red">*</span>图文
																</template>
																<div class="upload-border"
																     @click="openShowModal(sketchIndex,sketch.material_id)">
																	<img src="../../../assets/circle.png" alt/>
																	已选择1条图文
																	<p style="color: blue;margin: 14px;"
																	   @click="openShowModal(sketchIndex,sketch.material_id)">
																		[修改]</p>
																</div>
																<a-button type="primary" ghost
																          style="margin-right: 15px;"
																          @click="addSketch(sketchIndex)"
																          v-show="sketch.addSketchVisible">
																	<a-icon type="plus"/>
																	添加图文
																</a-button>
																<a-button @click="deleteSketch(sketchIndex,index)">删除该条
																</a-button>
															</a-form-item>
														</template>
														<div v-show="sketchIndex != element.sketchList.length - 1"
														     style="height: 1px; border:1px dashed #E2E2E2;margin: 5px 0px; width: 100%">
														</div>
													</template>
													<template v-if="element.typeValue == 2">
														<!-- 上传图片 -->
														<!-- 选中前 -->
														<a-form-item label="上传图片" :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }"
														             v-show="element.closeShowModal3==false">
															<div class="upload-wrap" style="display: inline-block;"
															     @click="openShowModal">
																<a-icon type="plus" class="upload-plus"/>
															</div>
															<span style="vertical-align: bottom;">（图片大小不超过2M，支持JPG、JPEG及PNG格式）</span>
															<div>
																<a-button @click="deleteMaterial(index)">删除该条</a-button>
															</div>
														</a-form-item>
														<!-- 选中后 -->
														<a-form-item label="上传图片" :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }"
														             v-show="element.closeShowModal3">
															<div class="upload-wrap"
															     @click="openShowModal(index,element.material_id)">
																<img :src="element.local_path.img" alt=""
																     class="upload-wrap-pic">
															</div>
															<span
																	style="color: blue;position: absolute;bottom: 30px;left: 110px;cursor: pointer;"
																	@click="openShowModal(index,element.material_id)">重新上传</span>
															<a-button style="display: block;margin-top: 10px;"
															          @click="deleteMaterial(index,element.id)">删除该条
															</a-button>
														</a-form-item>
													</template>
													<template v-if="element.typeValue == 1">
														<!-- 文字消息 -->
														<a-form-item label="文字消息" :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }">
															<medium-editor ref="medium_editor" :data-key="index"
															               class="content-editable"
															               :text="element.textAreaValueHeader"
															               :options="options"
															               @editorCreated="editorCreated"
															               @edit="changeContentInput" custom-tag="div"/>
															<div style="margin-right: 15px;float: right;">
																{{element.wordNum}}/{{element.wordLimit}}
															</div>
															<div style="padding: 0 15px;">
																点击插入：
																<a-button class="ant-tag ant-tag-orange" size="small"
																          @click="addTag">粉丝昵称
																</a-button>
																<a-popover trigger="click" :destroyTooltipOnHide="true"
																           v-model="element.emojiShow">
																	<VEmojiPicker slot="content"
																	              :showSearch="false"
																	              @select="onSelectEmoji"/>
																	<a-icon type="smile" class="icon-btn"
																	        style="cursor: pointer;"/>
																</a-popover>
															</div>
															<div class="changeType-text">
																如何设置链接：输入文案后， 鼠标选中想要插入链接的关键词，点击出现的“设置链接”，即可填入链接。
																提示：火狐浏览器可能出现无法正确插入粉丝昵称，请使用谷歌、360浏览器
															</div>
															<a-button @click="deleteMaterial(index)">删除该条</a-button>
														</a-form-item>
													</template>
													<template v-if="element.typeValue == 3">
														<!-- 语音 -->
														<!-- 选中前 -->
														<a-form-item label="语音" :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }"
														             v-show="element.closeShowModal3==false">
															<div class="upload-border" @click="openShowModal">
																<a-icon type="plus" class="upload-plus"/>
																<span>选择音频消息</span>
															</div>
															<a-button @click="deleteMaterial(index)">删除该条</a-button>
														</a-form-item>
														<!-- 选中后 -->
														<a-form-item label="语音" :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }"
														             v-show="element.closeShowModal3">
															<div class="upload-border"
															     @click="openShowModal(index,element.material_id)">
																<img src="../../../assets/circle.png" alt/>
																已选择1条语音
																<p style="color: blue;margin: 14px;"
																   @click="openShowModal(index,element.material_id)">
																	[修改]</p>
															</div>
															<a-button @click="deleteMaterial(index)">删除该条</a-button>
														</a-form-item>
													</template>
													<template v-if="element.typeValue == 4">
														<!-- 视频 -->
														<!-- 选中前 -->
														<a-form-item label="视频" :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }"
														             v-show="element.closeShowModal3==false">
															<div class="upload-border" @click="openShowModal">
																<a-icon type="plus" class="upload-plus"/>
																<span>选择视频消息</span>
															</div>
															<a-button @click="deleteMaterial(index)">删除该条</a-button>
														</a-form-item>
														<!-- 选中后 -->
														<a-form-item label="视频" :label-col="{ span: 3 }"
														             :wrapper-col="{ span: 21 }"
														             v-show="element.closeShowModal3">
															<div class="upload-border"
															     @click="openShowModal(index,element.material_id)">
																<img src="../../../assets/circle.png" alt/>
																已选择1条视频
																<p style="color: blue;margin: 14px;"
																   @click="openShowModal(index,element.material_id)">
																	[修改]</p>
															</div>
															<a-button @click="deleteMaterial(index)">删除该条</a-button>
														</a-form-item>
													</template>
												</a-form>
											</div>
										</a-form-item>
										<!-- 推送方式 -->
										<a-form-item label="推送方式" :label-col="{ span: 3 }" :wrapper-col="{ span: 14 }"
										             v-show="pushValue == 1">
											<a-radio-group name="radioGroup" v-model="pushType">
												<a-radio :value="2">全部推送</a-radio>
												<a-radio :value="1">随机推送一条</a-radio>
											</a-radio-group>
											<div style="height: 20px;border-bottom: 1px solid #E0E0E0;"></div>
										</a-form-item>
										<a-form-item>
											<div style="margin-top: 2px;margin-left: 12.5%;">
												<a-button type="primary" @click="createScene"
												          :disabled="createDisabled">
													<template v-if="typeof urlId == 'undefined'">创建</template>
													<template v-if="typeof urlId != 'undefined'">修改</template>
													渠道二维码
												</a-button>
											</div>
										</a-form-item>
									</a-form>
								</div>
							</div>
							<!-- 公众号选择弹窗 -->
							<wxModal :show="showModal2" :callback="modalVisibleChange" hasName="code-add"></wxModal>
							<!-- 选择消息弹窗 -->
							<chooseMsg :show="showModal3" :type="typeValue2" :news_type="news_type"
							           :callback="modalVisibleChange2" :chooseId="chooseId"></chooseMsg>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</a-spin>
		</div>
	</div>
</template>

<script>
	import wxModal from "@/components/WxModal.vue"
	import vuedraggable from "vuedraggable"
	import chooseMsg from "@/components/ChooseMsg.vue"
	import {videoPlayer} from "vue-video-player"
	import "video.js/dist/video-js.css"
	import { VEmojiPicker } from "v-emoji-picker"
	import WEmoji from "@/common/js/wechatEmoji.js"
	import moment from 'moment'
	import editor from 'vue2-medium-editor'
	import {message} from "ant-design-vue";

	export default {
		components: {
			wxModal, vuedraggable, chooseMsg, videoPlayer, VEmojiPicker,
			'medium-editor': editor
		},
		props     : {
			defaultTypeName: {
				type   : Object,
				default: () => {
					return {
						1: '文字',
						2: '图片',
						3: '音频',
						4: '视频',
						5: '图文',
					}
				}
			}
		},
		data () {
			let thisGlobal = this.global
			let changeBackground =
				this.$store.state.wxNum.length > 0 ? this.$store.state.wxNum : ""
			// console.log(this)
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
					// console.log(that.mediumEditor,'mediumEditor')

					let currentMediumEditor = that.mediumEditor[that.current]

					currentMediumEditor.saveSelection();

					let liElement = event.path[1]
					const toolbarWidth = liElement.parentElement.clientWidth;
					const toolbarHeight = liElement.parentElement.clientHeight;

					this.addMiniProgramForm(event);

					let domMiniProgram = liElement.parentElement.nextSibling.nextSibling
					const miniProgramWidth = 336;
					const miniProgramHeight = domMiniProgram.clientHeight;
					const domLeft = (toolbarWidth - miniProgramWidth) / 2;
					const domTop = toolbarHeight - miniProgramHeight + 2; // 加 2 是为了消除底部的重叠区域

					domMiniProgram.style.cssText =
						"display: block; visibility: visible; left: " + domLeft + "px; top: " + domTop + "px; width: " + miniProgramWidth + "px; position:absolute;";

					this.on(
						document.getElementById("miniSave"),
						"click",
						function () {
							let inpValue1 = liElement.parentElement.nextSibling.nextSibling.firstChild.children[0].value
							let inpValue2 = liElement.parentElement.nextSibling.nextSibling.firstChild.children[1].value
							let inpValue3 = liElement.parentElement.nextSibling.nextSibling.firstChild.children[2].value

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

				addMiniProgramForm: function (event) {
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

					let liElement = event.path[1]
					liElement.parentElement.parentElement.appendChild(miniProgramWrap);
				}
			})
			return {
				groupList       : [], // 小组列表
				isLoading       : false, //Loading 组件显示与隐藏
				wxInfo          : [], //微信公众号列表
				avatarImg       : "", //微信公众号头像
				showModal2      : false, //公众号组件弹窗显示与隐藏
				changeBackground: changeBackground, //选中背景色
				wxNum           : changeBackground, //修改后的微信id值
				msg_title       : '',//二维码名称
				validity        : 1,//有效期
				tagsList        : [],//标签列表
				tag_arr         : [], //标签值数组
				tag_ids         : "", //标签值
				// 标签
				checked         : [],
				pushValue       : true,//新建扫码推送类型
				num             : 1,//推送内容图文顺序
				visible         : false, //新建标签
				confirmLoading3 : false, //新建标签弹框加载
				inputValue      : "", //新建标签输入框值
				jumpVisible     : false,//添加图文气泡的显示与隐藏
				showModal3      : false, //选择消息对话框的显示与隐藏
				commonUrl       : this.$store.state.commonUrl, //公共的链接
				playerOptions   : {
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
				typeValue2      : 1, //传给子组件的type值，获取素材接口1为图文，所以要将传给子组件的type值改成1
				list            : [
					{
						typeValue          : 2,//消息类型，5图文，2图片，1文字，3音频，4视频
						typeName           : this.defaultTypeName,
						id                 : 0,
						closeShowModal3    : false,//是否选好素材
						disabled           : false,//消息类型图文能否被选
						file_name          : "", //手机上展示的素材标题
						material_id        : "", //选中的素材id
						local_path         : {
							img  : "",
							audio: ""
						}, //手机上展示的图片、音频、视频链接
						sketchList         : [
							{
								id                : 0,
								addSketchVisible  : true,//控制添加图文按钮显示与隐藏
								addType           : 1,//添加方式
								inputTitle        : '',//标题
								digest            : '',//图文描述
								content_source_url: '',//跳转链接
								material_id       : '',//图文消息导入的素材id
								local_path        : {
									img  : require('../../../assets/img.png'),
									audio: ""
								},
								closeShowModal3   : false,//每个图文消息是否选好素材
								materialSync      : 0,//素材是否同步，0不同步，1同步
								selectGroupId     : '',// 上传选择的分组id
							}
						],//图文消息添加的数组
						textAreaValueHeader: "", //模板展示的内容
						emojiShow          : false, // emoji表情选择框是否显示
						textContent        : '',//编辑框传给后台的内容
						wordNum            : 0,//编辑框的字数
						wordLimit          : 300, //  编辑框文字限制
					},
				],
				number          : 1,
				number2         : 1,
				current         : 0,//当前选中的tab值的index值
				currentSketch   : 0,//当前选中的图文中新建的模块的index值
				news_type       : null,//给组件传值，1为单图文
				isPlayMusic     : true, //音频小喇叭的显示与隐藏
				isPlayMusic2    : false, //动态音频小喇叭的显示与隐藏
				pushType        : 2,//推送方式
				mediumEditor    : [],   // 初始化的medium-editor
				options         : {
					toolbar      : {
						buttons: [
							{
								name          : "anchor",
								contentDefault: "设置链接"
							},
							{
								name: "miniProgram"
							},
							{
								name          : "removeFormat",
								action        : "unlink",
								contentDefault: "移除链接"
							}
						]
					},
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
				},
				urlId           : "", //地址栏参数id值
				replyList       : [],//存详情的数组
				newTagList      : [], //新建标签数组
				chooseId        : 0,//跳入组件时，选择好的id
				createDisabled  : false,//创建按钮的置灰
				isLoading       : false, //Loading 组件显示与隐藏
				keydownNode     : false,
				keydownNodeIndex: 0,
			}
		},

		methods: {
			goBack(){
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push("/scene/list?isRefresh=1")
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
			},
			// 修改emoji的显示与否的参数
			toggleDialogEmoji () {
				this.list[this.current].emojiShow = !this.list[this.current].emojiShow
			},
			// 选择emoji表情的事件
			onSelectEmoji (dataEmoji) {
				var dom = this.mediumEditor[this.current].options.ownerDocument
				if (this.list[this.current].wordLimit - this.list[this.current].wordNum >= 2) {
					this.insertHTMLCommand(dom, dataEmoji.data)
				}
				// Optional
				this.toggleDialogEmoji()
			},
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
			},
			// 插入自定义HTML
			insertHTMLCommand (doc, html) {
				if (typeof self.lastNode === 'undefined' || !self.lastNode.classList.contains("content-editable") || self.lastNode.dataset.key != this.current) {
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
				// console.log(self.lastNode.textContent,self.lastNode.textContent.length)
				this.list[this.current].wordNum = self.lastNode.textContent.length
				if (this.list[this.current].wordNum <= this.list[this.current].wordLimit) {
					this.list[this.current].textAreaValueHeader = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					if (typeof this.urlId == 'undefined') {
						this.list[this.current].textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					} else {
						this.list[this.current].textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>&nbsp;/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					}
				}

				this.mediumEditor[this.current].origElements.scrollTop = this.mediumEditor[this.current].origElements.scrollHeight

				let event = {
					currentTarget: this.mediumEditor[this.current].origElements
				}
				this.mediumEditor[this.current].events.updateInput(event.currentTarget, event);
			},
			// 插件初始化成功的回调
			editorCreated (mediumEditor) {
				if (typeof this.urlId == 'undefined') {
					this.$set(this.mediumEditor, this.current, mediumEditor)
					this.mediumEditor[this.current].subscribe('focus', this.editableFocus);
					this.mediumEditor[this.current].subscribe('editableKeydown', this.editableKeydown);
					this.mediumEditor[this.current].subscribe('editablePaste', this.editablePaste);
				} else {
					let index = mediumEditor.origElements.dataset.key
					this.$set(this.mediumEditor, index, mediumEditor)
					this.mediumEditor[index].subscribe('focus', this.editableFocus);
					this.mediumEditor[index].subscribe('editableKeydown', this.editableKeydown);
					this.mediumEditor[index].subscribe('editablePaste', this.editablePaste);
				}

				delete self.lastRange
				delete self.lastNode
			},
			// 文本域获取焦点
			editableFocus (e) {
				if (e.target.innerHTML === '' || e.target.innerHTML == '<br>' || e.target.innerHTML == '<p></p>') {
					e.target.innerHTML = '<p><br/></p>';
				}
			},
			//监听键盘事件，超过300字，不让输入
			editableKeydown (event) {
				if (this.list[this.current].wordNum >= this.list[this.current].wordLimit && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && !(event.keyCode == 65 && (event.metaKey || event.ctrlKey))) {
					event.preventDefault();
				}

				if (event.keyCode == 86 && (event.metaKey || event.ctrlKey)) {
					console.log(123);
				}
				if (event.keyCode == 13) {
					this.keydownNodeIndex = 0
					this.getParentP4Label(self.lastRange.startContainer)
				}
				this.keydownNode = event.keyCode == 13
			},
			// 找到startContainer的p父元素
			getParentP4Label (node) {
				if (node.nodeName != 'P') {
					this.getParentP4Label(node.parentNode)
				} else {
					this.getPreviousSiblingIndex(node)
					return
				}
			},
			// node前面兄弟元素的个数
			getPreviousSiblingIndex (node) {
				if (node.previousSibling) {
					this.keydownNodeIndex++
					this.getPreviousSiblingIndex(node.previousSibling)
				} else {
					return
				}
			},
			//监听粘贴事件
			editablePaste (event, target) {
				this.invlideText()
			},
			invlideText () {
				const customNode = this.mediumEditor[this.current].origElements
				const {startNode, startOffset, endNode, endOffset} = this.global.getRangeInfo(customNode, this.list[this.current].wordLimit);

				if (typeof startNode.nodeValue !== 'undefined') {
					let newRange = document.createRange()
					newRange.setStart(startNode, startOffset);
					newRange.setEnd(endNode, endOffset);
					// let newSelection = window.getSelection();
					// newSelection.removeAllRanges();
					// newSelection.addRange(newRange)
					newRange.deleteContents()

					this.list[this.current].textAreaValueHeader = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					if (typeof this.urlId == 'undefined') {
						this.list[this.current].textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					} else {
						this.list[this.current].textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					}
					this.list[this.current].wordNum = this.list[this.current].wordLimit

				}
				var divscll = this.mediumEditor[this.current].origElements;
				divscll.scrollTop = divscll.clientHeight
			},
			changeContentInput (operation) {
				if (operation.api.origElements.innerHTML == '' || operation.api.origElements.innerHTML == '<br>') {
					operation.api.origElements.innerHTML = '<p><br/></p>'
				}

				//判断链接格式
				var reg = /href="(?![a-zA-z]+:\/\/)[^"]*/g
				if (reg.test(operation.api.origElements.innerHTML)) {
					this.$message.error('请填写正确的链接')
					this.mediumEditor[this.current].execAction('unlink')
					return false
				}

				// var dom = this.mediumEditor[this.current].options.ownerDocument
				// this.insertHTMLCommand(dom, '')
				this.list[this.current].wordNum = self.lastNode.textContent.length
				if (this.list[this.current].wordNum <= this.list[this.current].wordLimit) {
					this.list[this.current].textAreaValueHeader = operation.api.origElements.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					if (typeof this.urlId == 'undefined') {
						this.list[this.current].textContent = operation.api.origElements.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/<br([^>]*)>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					} else {
						this.list[this.current].textContent = operation.api.origElements.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
					}
				} else {
					this.invlideText();
				}
				if (this.keydownNode) {
					let startNode = self.lastNode.childNodes[this.keydownNodeIndex + 1]
					let newRange = document.createRange()
					newRange.setStart(startNode, 0)
					let newSelection = window.getSelection()
					newSelection.removeAllRanges()
					newSelection.addRange(newRange)
					this.keydownNode = false
				}
			}
			,
			//点击插入粉丝昵称标签
			addTag   : function () {
				var dom = this.mediumEditor[this.current].options.ownerDocument
				const html =
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;</span>'
				if (this.list[this.current].wordLimit - this.list[this.current].wordNum >= 6) {
					this.insertHTMLCommand(dom, html)
				}
			}
			,
			//更换公众号
			add () {
				if (this.$route.query.id) {
					return
				}
				this.showModal2 = true
				this.isLoading = true;
			}
			,
			modalVisibleChange (event, wxNum, wxNickName) {
				// console.log('wxNickName', wxNickName);
				if (event == "ok") {
					this.isLoading = false;
					this.showModal2 = false
					this.$store.dispatch("changeWxNum", wxNum)
					this.$store.commit("changeWxNickName", wxNickName);
					this.avatarImg = this.wxInfo[this.$store.state.wxNumIndex].head_img
					this.getTags()
					this.msg_title = ''
					this.validity = 1
					this.tag_arr = []
					this.tag_ids = ''
					this.checked = []
					this.pushValue = true
					this.pushType = 2
					this.current = 0
					this.list = [{
						typeValue          : 2,//消息类型，5图文，2图片，1文字，3音频，4视频
						typeName           : this.defaultTypeName,
						id                 : 0,
						closeShowModal3    : false,//是否选好素材
						disabled           : false,//消息类型图文能否被选
						file_name          : "", //手机上展示的素材标题
						material_id        : "", //选中的素材id
						local_path         : {
							img  : "",
							audio: ""
						}, //手机上展示的图片、音频、视频链接
						sketchList         : [
							{
								id                : 0,
								addSketchVisible  : true,//控制添加图文按钮显示与隐藏
								addType           : 1,//添加方式
								inputTitle        : '',//标题
								digest            : '',//图文描述
								content_source_url: '',//跳转链接
								material_id       : '',//图文消息导入的素材id
								local_path        : {
									img  : require('../../../assets/img.png'),
									audio: ""
								},
								closeShowModal3   : false,//每个图文消息是否选好素材
								materialSync      : 0,//素材是否同步，0不同步，1同步
								selectGroupId     : '',// 上传选择的分组id
							}
						],//图文消息添加的数组
						textAreaValueHeader: "", //模板展示的内容
						emojiShow          : false, // emoji表情选择框是否显示
						textContent        : '',//编辑框传给后台的内容
						wordNum            : 0,//编辑框的字数
						wordLimit          : 300, //  编辑框文字限制
					}]
				} else {
					this.isLoading = false;
					this.showModal2 = false
				}
			}
			,
			//更换消息类型
			changeTypeValue (index) {
				this.list[index].closeShowModal3 = false
				this.list[index].sketchList = this.list[index].sketchList.slice(0, 1)
				this.list[index].sketchList[0].closeShowModal3 = false
				this.list[index].sketchList[0].local_path.img = require('../../../assets/img.png')
				this.list[index].sketchList[0].local_path.audio = ''
				this.list[index].sketchList[0].inputTitle = ''
				this.list[index].sketchList[0].digest = ''
				this.list[index].sketchList[0].content_source_url = ''
				this.list[index].local_path.img = ''
				this.list[index].local_path.audio = ''
				this.list[index].closeShowModal3 = false
				this.list[index].material_id = ''
				this.list[index].sketchList[0].material_id = 0
				this.list[index].textAreaValueHeader = ''
				this.list[index].textContent = ''
				this.list[index].sketchList[0].materialSync = 0
				this.list[index].sketchList[0].selectGroupId = ''

				delete self.lastRange
				delete self.lastNode
			}
			,
			//更换添加方式
			changeAddType (sketchIndex) {
				this.list[this.current].sketchList[sketchIndex].closeShowModal3 = false
				this.list[this.current].sketchList[sketchIndex].closeShowModal3 = false
				this.list[this.current].sketchList[sketchIndex].local_path.img = require('../../../assets/img.png')
				this.list[this.current].sketchList[sketchIndex].local_path.audio = ''
				this.list[this.current].sketchList[sketchIndex].inputTitle = ''
				this.list[this.current].sketchList[sketchIndex].digest = ''
				this.list[this.current].sketchList[sketchIndex].content_source_url = ''
				this.list[this.current].sketchList[sketchIndex].material_id = ''
				this.list[this.current].sketchList[sketchIndex].materialSync = 0
				this.list[this.current].sketchList[sketchIndex].selectGroupId = ''
			}
			,
			//获取标签
			async getTags () {
				const {data: res} = await this.axios.post("tags/tags-get-all", {
					wx_id:localStorage.getItem('wxNum'),
					type: 1
				})
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg)
				} else {
					this.isLoading = false
					this.tagsList = res.data.info
					for (let i = 0; i < this.tagsList.length; i++) {
						var checked = false
						this.checked.push(checked)
					}
					if (this.tag_arr.length > 0) {
						for (let j = 0; j < this.tag_arr.length; j++) {
							for (let i = 0; i < this.tagsList.length; i++) {
								if (this.tag_arr[j] == this.tagsList[i].key) {
									this.checked[i] = true
								}
							}
						}
					}
				}
			}
			,
			//标签
			changeTags (key) {
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
				if (this.tag_arr.includes(key)) {
					this.tag_arr.remove(key)
				} else {
					if (this.tag_arr.length + 1 > 20) {
						this.$message.warning('不可选中，粉丝标签数量上限20个')
						for (let i = 0; i < this.tagsList.length; i++) {
							if (this.tagsList[i].key == key) {
								this.checked[i] = false
							}
						}
					} else {
						this.tag_arr.push(key)
					}
				}
				this.tag_ids = this.tag_arr.join()
			}
			,
			//新建标签
			createTag () {
				if (this.tagsList.length >= 100) {
					this.$message.warning("标签数量已超过上限100个，无法创建")
					return false
				} else {
					this.visible = true
				}
			}
			,
			handleOk (val) {
				let that = this
				that.confirmLoading3 = true
				if (val == "") {
					that.$message.warning("不能为空")
					that.confirmLoading3 = false
					return false
				} else {
					for (var i = 0; i < val.split(" ").length; i++) {
						if (val.split(" ")[i].length > 6) {
							that.$message.error("每个标签最多6个字")
							that.confirmLoading3 = false
							return false
						} else if (
							val.split(" ")[i].length > 0
						) {
							that.newTagList.push(val.split(" ")[i])
						}
					}
					that.addTags()
					that.inputValue = "";
					that.newTagList = []
				}
			}
			,
			async addTags () {
				const {data: res} = await this.axios.post("tags/tags-create", {
					wx_id:localStorage.getItem('wxNum'),
					tag_name: this.newTagList
				})
				if (res.error != 0) {
					this.$message.error(res.error_msg)
					this.confirmLoading3 = false
				} else {
					this.isLoading = true
					this.visible = false
					this.confirmLoading3 = false
					this.getTags()
					this.inputValue = ""
					this.newTagList = []
				}
			}
			,
			cancel () {
				this.visible = false
				this.inputValue = ''
			}
			,
			//扫码推送
			changeStatus (value) {
				// console.log(value)
				this.pushValue = value
			}
			,
			//推送内容
			//新建左边
			createPullLeft () {
				this.current = this.list.length
				this.list.push({
					typeValue          : 2, id:
						this.number++,
					typeName           : this.defaultTypeName,
					closeShowModal3    : false,
					disabled           : false,
					file_name          : "", //手机上展示的素材标题
					material_id        : '',
					local_path         : {
						img  : "",
						audio: ""
					}, //手机上展示的图片、音频、视频链接
					sketchList         : [{
						id                : 0,
						addSketchVisible  : true,//控制添加图文按钮显示与隐藏
						addType           : 1,//添加方式
						inputTitle        : '',//标题
						digest            : '',//图文描述
						content_source_url: '',//跳转链接
						material_id       : '',//图文消息导入的素材id
						local_path        : {
							img  : require('../../../assets/img.png'),
							audio: ""
						},
						closeShowModal3   : false,
						materialSync      : 0,//素材是否同步，0不同步，1同步
						selectGroupId     : '',// 上传选择的分组id
					}],//图文消息添加的数组
					textAreaValueHeader: "", //模板展示的内容
					emojiShow          : false, // emoji表情选择框是否显示
					textContent        : '',//编辑框传给后台的内容
					wordNum            : 0,//编辑框的字数
					wordLimit          : 300, //  编辑框文字限制
				})
				// console.log(this.list)
				var hasTypeValue = false
				for (let i = 0; i < this.list.length; i++) {
					if (this.list[i].typeValue == 5) {
						hasTypeValue = true
					}
				}
				for (let i = 0; i < this.list.length; i++) {
					if (hasTypeValue) {
						if (this.list[i].typeValue == 5) {
							this.list[i].disabled = false
						} else {
							this.list[i].disabled = true
						}
					} else {
						this.list[i].disabled = false
					}
				}
			}
			,
			clickTab (index) {
				this.current = index
				var hasTypeValue = false
				for (let i = 0; i < this.list.length; i++) {
					if (this.list[i].typeValue == 5) {
						hasTypeValue = true
					}
				}
				for (let i = 0; i < this.list.length; i++) {
					if (hasTypeValue) {
						if (this.list[i].typeValue == 5) {
							this.list[i].disabled = false
						} else {
							this.list[i].disabled = true
						}
					} else {
						this.list[i].disabled = false
					}
				}
			}
			,
			checkMove: function (e) {
				console.log(e.draggedContext.futureIndex)
			}
			,
			//打开上传页面
			openShowModal (sketchIndex, id) {
				if (typeof id == 'undefined') {
					this.chooseId = 0
				} else {
					this.chooseId = Number(id)
				}
				this.currentSketch = sketchIndex
				this.showModal3 = true
				//消息类型为图文，素材库对应类型为1，所以要修改为1；若添加方式为新建，则打开图片素材弹窗
				if (this.list[this.current].typeValue == 5 && this.list[this.current].sketchList[sketchIndex].addType == 1) {
					this.typeValue2 = 2
				} else if (this.list[this.current].typeValue == 5) {
					this.typeValue2 = 1
					this.news_type = 1
				} else {
					this.typeValue2 = this.list[this.current].typeValue
				}
			}
			,
			modalVisibleChange2 (event, e, id) {
				if (event == "ok") {
					if (isNaN(id) || id == '') {
						this.$message.error('请选择素材')
						this.showModal3 = false
					} else {
						this.list[this.current].closeShowModal3 = true
						this.showModal3 = false
						if (this.list[this.current].typeValue == 5) {
							this.list[this.current].sketchList[this.currentSketch].material_id = id
						} else {
							this.list[this.current].material_id = id
						}

						this.getOneMaterial()
					}
				} else {
					this.showModal3 = false
				}
			}
			,
			//根据组件返回的id获取单个素材信息
			async getOneMaterial () {
				let material_id = 0
				if (this.list[this.current].typeValue == 5) {
					material_id = this.list[this.current].sketchList[this.currentSketch].material_id
				} else {
					material_id = this.list[this.current].material_id
				}
				const {data: res} = await this.axios.post("material/upload-media", {
					wx_id        : localStorage.getItem('wxNum'),
					attachment_id: material_id
				})
				// console.log(res)
				if (res.error == 0) {
					this.materialList = res.data[material_id]
					if (this.list[this.current].typeValue == 5 && this.list[this.current].sketchList[this.currentSketch].addType == 1) {
						this.list[this.current].sketchList[this.currentSketch].local_path.img = this.commonUrl + this.materialList.local_path
						this.list[this.current].sketchList[this.currentSketch].closeShowModal3 = true
					} else if (this.list[this.current].typeValue == 5 && this.list[this.current].sketchList[this.currentSketch].addType == 0) {
						this.list[this.current].sketchList[this.currentSketch].material_id = this.materialList.id
						this.list[this.current].sketchList[this.currentSketch].closeShowModal3 = true
						this.list[this.current].sketchList[this.currentSketch].local_path.img = this.commonUrl + this.materialList.artList[0].local_path
						this.list[this.current].sketchList[this.currentSketch].inputTitle = this.materialList.artList[0].title
						this.list[this.current].sketchList[this.currentSketch].digest = this.materialList.artList[0].digest
						this.list[this.current].sketchList[this.currentSketch].content_source_url = this.materialList.artList[0].content_source_url
						this.list[this.current].sketchList[this.currentSketch].materialSync = this.materialList.artList[0].is_sync
						this.list[this.current].sketchList[this.currentSketch].selectGroupId = this.materialList.artList[0].group_id
					} else if (this.list[this.current].typeValue == 4) {
						this.list[this.current].file_name = this.materialList.file_name
						this.list[this.current].closeShowModal3 = true
						// var sourceData = [
						//     {
						//         src: this.commonUrl + this.materialList.local_path, // 路径
						//         type: "video/mp4" // 类型
						//     }
						// ];
						// this.$set(this.playerOptions, "sources", sourceData)
					} else if (this.list[this.current].typeValue == 3) {
						this.list[this.current].local_path.audio = this.commonUrl + this.materialList.local_path
						this.list[this.current].file_name = this.materialList.file_name
						this.list[this.current].closeShowModal3 = true
					} else {
						this.list[this.current].local_path.img = this.commonUrl + this.materialList.local_path
						this.list[this.current].file_name = this.materialList.file_name
						this.list[this.current].closeShowModal3 = true
					}
				} else {
					this.$message.error(res.error_msg)
				}
				// console.log(this.materialList)
			}
			,
			//添加图文
			addSketch (sketchIndex) {
				if (this.list[this.current].sketchList.length >= 8) {
					this.$message.error('最多添加8条图文')
				} else {
					this.list[this.current].sketchList[sketchIndex].addSketchVisible = false
					this.list[this.current].sketchList.push({
						id                : this.number2++,
						addType           : 1,
						inputTitle        : '',
						digest            : '',
						content_source_url: '',
						material_id       : '',
						addSketchVisible  : true,
						local_path        : {
							img  : require('../../../assets/img.png'),
							audio: ""
						},
						closeShowModal3   : false,
						materialSync      : 0,//素材是否同步，0不同步，1同步
						selectGroupId     : '',// 上传选择的分组id
					})
				}
			}
			,
			//播放音频
			playMusic () {
				this.isPlayMusic = false
				this.isPlayMusic2 = true
				this.$nextTick(() => {
					// console.log(this.$refs.audio[0]);
					this.$refs.audio[0].play()
					var t1 = setInterval(() => {
						// console.log(this.$refs.audio[index].paused);
						if (this.$refs.audio[0].paused) {
							clearInterval(t1)
							this.isPlayMusic = true
							this.isPlayMusic2 = false
						}
					}, 1000)
				})
			}
			,
			//图片、音频、视频删除该条按钮
			deleteMaterial (index) {
				if (this.list.length > 2) {
					if (this.current - 1 >= 0) {
						this.current = this.current - 1
					} else {
						this.current = this.current + 1
					}
					this.list.splice(index, 1)
				} else if (this.list.length == 2) {
					if (this.current > 0) {
						this.current = 0
					}
					this.list.splice(index, 1)
				} else {
					this.list = [
						{
							typeValue          : 2,//消息类型，5图文，2图片，1文字，3音频，4视频
							typeName           : this.defaultTypeName,
							id                 : 0,
							closeShowModal3    : false,//是否选好素材
							disabled           : false,//消息类型图文能否被选
							file_name          : "", //手机上展示的素材标题
							material_id        : "", //选中的素材id
							local_path         : {
								img  : "",
								audio: ""
							}, //手机上展示的图片、音频、视频链接
							sketchList         : [
								{
									id                : 0,
									addSketchVisible  : true,//控制添加图文按钮显示与隐藏
									addType           : 1,//添加方式
									inputTitle        : '',//标题
									digest            : '',//图文描述
									content_source_url: '',//跳转链接
									material_id       : '',//图文消息导入的素材id
									local_path        : {
										img  : require('../../../assets/img.png'),
										audio: ""
									},
									closeShowModal3   : false,//每个图文消息是否选好素材
									materialSync      : 0,//素材是否同步，0不同步，1同步
									selectGroupId     : '',// 上传选择的分组id
								}
							],//图文消息添加的数组
							textAreaValueHeader: "", //模板展示的内容
							emojiShow          : false, // emoji表情选择框是否显示
							textContent        : '',//编辑框传给后台的内容
							wordNum            : 0,//编辑框的字数
							wordLimit          : 300, //  编辑框文字限制
						},
					]//图文消息添加的数组
				}
			}
			,
			//图文删除该条按钮
			deleteSketch (sketchIndex, index) {
				if (this.list.length > 1) {
					if (this.list[this.current].sketchList.length > 1) {
						if (sketchIndex == this.list[this.current].sketchList.length - 1) {
							this.list[this.current].sketchList[sketchIndex - 1].addSketchVisible = true
						}
						this.list[this.current].sketchList.splice(sketchIndex, 1)
					} else {
						this.list.splice(index, 1)
						if (this.current - 1 >= 0) {
							this.current = this.current - 1
						} else {
							this.current = 0
						}
						this.list[this.current].disabled = false
					}
				} else {
					if (this.list[this.current].sketchList.length > 1) {
						if (sketchIndex == this.list[this.current].sketchList.length - 1) {
							this.list[this.current].sketchList[sketchIndex - 1].addSketchVisible = true
						}
						this.list[this.current].sketchList.splice(sketchIndex, 1)
					} else {
						this.list = [
							{
								typeValue          : 2,//消息类型，5图文，2图片，1文字，3音频，4视频
								typeName           : this.defaultTypeName,
								id                 : 0,
								closeShowModal3    : false,//是否选好素材
								disabled           : false,//消息类型图文能否被选
								file_name          : "", //手机上展示的素材标题
								material_id        : "", //选中的素材id
								local_path         : {
									img  : "",
									audio: ""
								}, //手机上展示的图片、音频、视频链接
								sketchList         : [
									{
										id                : 0,
										addSketchVisible  : true,//控制添加图文按钮显示与隐藏
										addType           : 1,//添加方式
										inputTitle        : '',//标题
										digest            : '',//图文描述
										content_source_url: '',//跳转链接
										material_id       : '',//图文消息导入的素材id
										local_path        : {
											img  : require('../../../assets/img.png'),
											audio: ""
										},
										closeShowModal3   : false,//每个图文消息是否选好素材
										materialSync      : 0,//素材是否同步，0不同步，1同步
										selectGroupId     : '',// 上传选择的分组id
									}
								],//图文消息添加的数组
								textAreaValueHeader: "", //模板展示的内容
								emojiShow          : false, // emoji表情选择框是否显示
								textContent        : '',//编辑框传给后台的内容
								wordNum            : 0,//编辑框的字数
								wordLimit          : 300, //  编辑框文字限制
							},
						]//图文消息添加的数组
					}
				}
			}
			,
			//创建渠道二维码
			async createScene () {
				this.createDisabled = true
				// console.log(this.list, 'list')
				let msgData = []
				const defaultMsgData = {
					type       : '',
					content    : '',
					material_id: '',
					newsList   : []
				}
				const defaultNewsList = {
					is_use     : '',
					material_id: '',
					title      : '',
					digest     : '',
					cover_url  : '',
					content_url: '',
					is_sync    : 0,
					group_id   : '',
					attach_id  : ''
				}
				// console.log(this.list,'list')
				for (let i = 0; i < this.list.length; i++) {
					let listData = JSON.parse(JSON.stringify(defaultMsgData))
					listData.type = this.list[i].typeValue
					if (this.list[i].typeValue == 1) {
						// console.log(this.list[i].textContent)
						if (this.list[i].textContent == '\n') {
							this.list[i].textContent = ''
						} else {
							listData.content = this.list[i].textContent
						}
					} else if (this.list[i].typeValue == 5) {
						if (this.list[i].sketchList.length > 1 && this.pushType == 2 && i != 0) {
							this.$message.error('因接口限制，“全部推送”仅支持首条回复多图文')
							this.createDisabled = false
							return false
						}

						for (let j = 0; j < this.list[i].sketchList.length; j++) {
							let pushData = JSON.parse(JSON.stringify(defaultNewsList))
							pushData.is_use = this.list[i].sketchList[j].addType
							if (pushData.is_use == 0) {
								pushData.material_id = this.list[i].sketchList[j].material_id
								listData.newsList.push(pushData)
							} else {
								pushData.title = this.list[i].sketchList[j].inputTitle
								if (typeof this.list[i].sketchList[j].digest == 'undefined') {
									pushData.digest = ''
								} else {
									pushData.digest = this.list[i].sketchList[j].digest
								}
								pushData.cover_url = this.list[i].sketchList[j].local_path.img
								pushData.content_url = this.list[i].sketchList[j].content_source_url
								pushData.material_id = this.list[i].sketchList[j].material_id
								pushData.is_sync = this.list[i].sketchList[j].materialSync
								pushData.group_id = this.list[i].sketchList[j].selectGroupId
								pushData.attach_id = this.list[i].sketchList[j].attach_id
								listData.newsList.push(pushData)
							}
						}
						// console.log(this.list,'list')
						// console.log(listData,'listData')
					} else if (this.list[i].typeValue == 2) {
						listData.material_id = this.list[i].material_id
					} else {
						listData.material_id = this.list[i].material_id
					}
					msgData.push(listData)
					// console.log(msgData, 'msgData')
				}
				let status = 1
				if (this.pushValue == false) {
					status = 0
				}
				let postUrl = 'scene/add'
				if (typeof this.urlId != 'undefined') {
					postUrl = 'scene/update'
				}
				if (this.msg_title == '') {
					this.$message.error('请填写二维码名称')
					this.createDisabled = false
				} else {
					if (this.pushValue) {
						for (let i = 0; i < msgData.length; i++) {
							for (let j = 0; j < msgData[i].newsList.length; j++) {
								if (msgData[i].newsList[j].is_use == 0) {
									if (msgData[i].newsList[j].material_id == '') {
										this.$message.error('请检查内容和设置是否填写完整，跳转链接格式是否正确，文字消息是否在 300 字符内')
										this.createDisabled = false
										return false;
									}
								} else {
									if (msgData[i].newsList[j].cover_url == require('../../../assets/img.png') || msgData[i].newsList[j].title == '' || msgData[i].newsList[j].content_url == '') {
										this.$message.error('请检查内容和设置是否填写完整，跳转链接格式是否正确，文字消息是否在 300 字符内')
										this.createDisabled = false
										return false;
									}
								}
							}
						}
					}

					// console.log(msgData,'msgData')
					const {data: res} = await this.axios.post(postUrl, {
						wx_id:localStorage.getItem('wxNum'),
						title    : this.msg_title,
						time_type: this.validity,
						status   : status,
						push_type: this.pushType,
						tagIds   : this.tag_ids,
						msgData  : msgData,
						scene_id : this.urlId
					})
					// console.log(res)
					if (res.error != 0) {
						this.$message.error(res.error_msg)
						this.createDisabled = false
					} else {
						this.$message.success("操作成功")
						localStorage.removeItem('notAllow')
						localStorage.removeItem('backUrl')
						this.createDisabled = false
						if(typeof this.urlId == 'undefined') {
							this.$router.push("/scene/list")
						} else {
							this.$router.push("/scene/list?isRefresh=1")
						}
					}
				}
			}
			,
			//点击修改进入页面，获取详情
			async getDetail () {
				const {data: res} = await this.axios.post(
					"scene/info",
					{
						scene_id: this.urlId
					}
				)
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg)
				} else {
					this.isLoading = false;
					this.msg_title = res.data.title
					this.validity = res.data.time_type
					this.tag_ids = res.data.tagIds
					this.tag_arr = this.tag_ids.split(',')
					if (res.data.status == 0) {
						this.pushValue = false
					} else {
						this.pushValue = true
					}
					this.pushType = res.data.push_type
					this.replyList = res.data.replyList
					// console.log(this.replyList,'replyList')
					if (this.replyList.length > 0) {
						this.list = []
						for (let i = 0; i < this.replyList.length; i++) {
							this.list.push({
								typeValue          : 2,//消息类型，5图文，2图片，1文字，3音频，4视频
								typeName           : this.defaultTypeName,
								id                 : 0,
								closeShowModal3    : true,//是否选好素材
								disabled           : false,//消息类型图文能否被选
								file_name          : "", //手机上展示的素材标题
								material_id        : "", //选中的素材id
								local_path         : {
									img  : "",
									audio: ""
								}, //手机上展示的图片、音频、视频链接
								sketchList         : [{
									id                : 0,
									addSketchVisible  : true,//控制添加图文按钮显示与隐藏
									addType           : 1,//添加方式
									inputTitle        : '',//标题
									digest            : '',//图文描述
									content_source_url: '',//跳转链接
									material_id       : '',//图文消息导入的素材id
									local_path        : {
										img  : require('../../../assets/img.png'),
										audio: ""
									},
									closeShowModal3   : true,//每个图文消息是否选好素材
									materialSync      : 0,//素材是否同步，0不同步，1同步
									selectGroupId     : '',// 上传选择的分组id
									attach_id         : ''
								}],//图文消息添加的数组
								textAreaValueHeader: "", //模板展示的内容
								emojiShow          : false, // emoji表情选择框是否显示
								textContent        : '',//编辑框传给后台的内容
								wordNum            : 0,//编辑框的字数
								wordLimit          : 300, //  编辑框文字限制
							})
							this.list[i].typeValue = this.replyList[i].typeValue
							if (this.list[i].typeValue == 5 && this.replyList[i].sketchList.length > 0) {
								for (let j = 0; j < this.replyList[i].sketchList.length; j++) {
									this.list[i].sketchList.push({
										id                : 0,
										addSketchVisible  : true,//控制添加图文按钮显示与隐藏
										addType           : 1,//添加方式
										inputTitle        : '',//标题
										digest            : '',//图文描述
										content_source_url: '',//跳转链接
										material_id       : '',//图文消息导入的素材id
										local_path        : {
											img  : require('../../../assets/img.png'),
											audio: ""
										},
										closeShowModal3   : true,//每个图文消息是否选好素材
										materialSync      : 0,//素材是否同步，0不同步，1同步
										selectGroupId     : '',// 上传选择的分组id
										disabledSync      : 0,//0不禁选，1禁选
										attach_id         : ''
									})
									this.list[i].sketchList[j].id = this.replyList[i].sketchList[j].id
									this.list[i].sketchList[j].addType = this.replyList[i].sketchList[j].addType
									this.list[i].sketchList[j].inputTitle = this.replyList[i].sketchList[j].inputTitle
									if (this.replyList[i].sketchList[j].digest !== null) {
										this.list[i].sketchList[j].digest = this.replyList[i].sketchList[j].digest
									}
									this.list[i].sketchList[j].content_source_url = this.replyList[i].sketchList[j].content_source_url
									this.list[i].sketchList[j].material_id = this.replyList[i].sketchList[j].material_id
									this.list[i].sketchList[j].local_path.img = this.replyList[i].sketchList[j].local_path.img
									this.list[i].sketchList[j].local_path.audio = this.replyList[i].sketchList[j].local_path.audio
									this.list[i].sketchList[j].materialSync = this.replyList[i].sketchList[j].is_sync
									this.list[i].sketchList[j].disabledSync = this.replyList[i].sketchList[j].is_sync
									this.list[i].sketchList[j].selectGroupId = this.replyList[i].sketchList[j].group_id
									this.list[i].sketchList[j].attach_id = this.replyList[i].sketchList[j].attach_id
								}
								// console.log(this.list, '555')
								for (let t = 0; t < this.list.length; t++) {
									if (this.list[t].typeValue == 5) {
										this.list[t].sketchList.splice(this.list[t].sketchList.length - 1, 1)
									}
								}
							} else {
								this.list[i].id = this.replyList[i].id
								this.list[i].file_name = this.replyList[i].file_name
								this.list[i].material_id = this.replyList[i].material_id
								this.list[i].local_path.img = this.replyList[i].local_path.img
								this.list[i].local_path.audio = this.replyList[i].local_path.audio
								this.list[i].textContent = this.replyList[i].textAreaValueHeader
								this.list[i].textAreaValueHeader = this.replyList[i].textAreaValueHeader.replace(
									/{nickname}/g,
									'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;</span>'
								).replace(/\n/g, '<br>')
								this.list[i].textAreaValueHeader = '<p>' + this.list[i].textAreaValueHeader + '</p>'
								let a = this.list[i].textContent.replace(/{nickname}/g, ' 粉丝昵称 ').replace(/\n/g, '').replace(/(<\/?a.*?>)/g, '')
								this.list[i].wordNum = a.length
							}
						}
						// console.log(this.list,'list')
					}
					this.list.map((x) => {
						if (x.typeValue == 5) {
							x.sketchList.map((y) => {
								if (y.cover_url == '') {
									y.closeShowModal3 = false
								}
							})
						} else {
							if (x.material_id === null) {
								x.closeShowModal3 = false
							}
						}
					})
					this.getTags()
				}
			},
			//素材同步
			changeMaterialSync (sketchIndex) {
				if (this.list[this.current].sketchList[sketchIndex].materialSync == 1) {
					this.getGroupList(sketchIndex)
				}
			},
			//获取分组列表
			async getGroupList (sketchIndex) {
				const isNullOrUndefined = obj => obj === null || obj === undefined;
				const {data: res} = await this.axios.post("attachment/group", {
					uid       : localStorage.getItem('uid'),
					is_channel: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					if (!isNullOrUndefined(sketchIndex)) {
						this.list[this.current].sketchList[sketchIndex].selectGroupId = this.groupList[0].key
					}
				}
			},
		},

		beforeCreate () {
			if (!this.$store.state.wxNum) {
				this.$router.back()
			}
		},
		created () {
			this.urlId = this.$route.query.id
			if (typeof this.urlId != "undefined") {
				this.isLoading = true;
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/scene/list')
				this.getGroupList()
				this.getDetail()
			}
			this.getTags()
			const _this = this
			this.$store.dispatch("getWx", info => {
				_this.wxInfo = info

				if (!_this.avatarImg) {
					_this.avatarImg = _this.wxInfo[_this.$store.state.wxNumIndex].head_img
				}
			})
			document.addEventListener("selectionchange", function () {
				_this.getCursor(self)
			})
		},
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/default.css";
	@import "../../../style/medium-editor-toolbar.css";

	.item-info {
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

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

	.hide {
		display: none !important;
	}

	#components-layout-demo-basic {
		height: 100%;
	}

	#components-layout-demo-basic .ant-layout-header {
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 760px;
		width: 100%;
		line-height: 50px;
	}

	/deep/ .ant-layout-header {
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}

	/deep/ .ant-radio-button-wrapper {
		width: 200px;
		height: 55px;
		line-height: 55px;
		padding: 0 10px;
		margin: 10px 5px;
	}

	/deep/ .ant-col-15 {
		margin-left: 15px;
	}

	/deep/ .ant-card-meta-avatar {
		float: right;
		padding: 0;
	}

	#components-layout-demo-basic .ant-layout-content {
		min-width: 760px;
		width: 100%;
		position: relative;
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

	#components-layout-demo-basic > .ant-layout {
		margin-bottom: 48px;
	}

	#components-layout-demo-basic > .ant-layout:last-child {
		margin: 0;
		height: 100%;
	}

	.list {
		height: 100%;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		position: absolute;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.content-hd {
		height: 80px;
		padding: 20px 0;
		border-bottom: 1px solid #E2E2E2;
	}

	.content-bd {
		background: #F5F5F5;
	}

	.msg_content_body {
		border-radius: 4px;
		font-size: 14px;
		color: #333333;
		margin: 20px;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 0 5px;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}

	.pull-left {
		width: 88px;
	}

	.push-type-item {
		position: relative;
		margin-bottom: 8px;
		border: 1px solid #D8D8D8;
		border-right: 0;
		z-index: 1;
		cursor: pointer;
		line-height: 38px;
	}

	.active {
		background: #FFF;
		margin-right: -1px;
	}

	.index {
		float: left;
		width: 30px;
		height: 38px;
		line-height: 38px;
		text-align: center;
		border-right: 1px solid #D8D8D8;
	}

	.type {
		display: inline-block;
		width: 57px;
		border-right: 1px solid transparent;
		text-align: center;
	}

	.add-new {
		background: #F9F9F9;
		cursor: pointer;
	}

	.add-icon {
		font-size: 12px;
		float: left;
		width: 30px;
		height: 38px;
		line-height: 38px;
		text-align: center;
		border: 1px dashed #D8D8D8;
		border-right: 0;
	}

	.add-btn {
		float: left;
		width: 58px;
		text-align: center;
		height: 38px;
		line-height: 38px;
		border: 1px dashed #D8D8D8;
		border-right: 0;
	}

	.pull-right {
		width: 560px;
		max-height: 630px;
		height: 630px;
		background: #FFF;
		border: 1px solid #D8D8D8;
		padding: 24px;
		overflow: auto;
	}

	.fl {
		float: left;
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

	.audio {
		width: 100%;
		height: 150px;
		padding: 50px 20px;
		background: #FFF;
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

	.upload-wrap {
		width: 96px;
		height: 96px;
		text-align: center;
		border: 1px dashed #D8D8D8;
		background: #FFF;
		cursor: pointer;
		margin-bottom: 10px;
		position: relative;
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

	.changeType-text {
		background: @color-bgc;
		border: 1px solid @border-color;
		border-radius: 2px;
		padding: 7px 27px 6px 10px;
		font-size: 12px;
		width: 100%;
		margin-top: 12px;
		max-width: 673px;
		line-height: 20px;
		margin-bottom: 15px;
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

	/deep/ .emoji {
		font-size: 20px;
		height: 40px !important;
		width: 40px !important;
	}

	.icon-btn {
		margin-right: 10px;
	}

	/deep/ .inputTitle {
		height: 30px;
		line-height: 30px;
		background: #0F0F0F;
		opacity: 0.3;
		color: #FFF;
		padding: 0 10px;
		margin-top: -30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		p {
			display: inline-block;
		}
	}

	/deep/ .inputTitle2 {
		background: #FFF;
		height: 104px;
		padding: 20px;

		p {
			display: inline-block;
			word-break: break-word;
			width: calc(100% - 74px);
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			float: left;
		}
	}

	.hideMask {
		color: rgba(0, 0, 0, 0.25);
		background-color: #F5F5F5;
		cursor: not-allowed;
		opacity: 0.5;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	/deep/ .ant-tag {
		margin: 5px;
		height: 26px;
		line-height: 25px;
	}

	/deep/ #components-layout-demo-basic .ant-layout-sider {
		background: #FFF;
		-webkit-box-flex: 0 !important;
		-ms-flex: 0 0 24% !important;
		flex: 0 0 24% !important;
		max-width: 24% !important;
		min-width: 24% !important;
		width: 24% !important;
		border-right: 1px solid #E2E2E2;
		padding: 20px 20px;
	}

	.upload-wrap-pic {
		max-width: 80px;
		max-height: 80px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.wrap {
		border: 1px solid #E2D6D6;
		margin: auto;
		height: 100%;
		width: 100%;
		background: #F5F5F5;
		overflow-y: auto;
		box-sizing: content-box;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
	}

	/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container, /deep/ .ant-layout {
		height: 100%;
	}
</style>