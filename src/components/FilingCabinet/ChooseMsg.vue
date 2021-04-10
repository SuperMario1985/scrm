<template>
	<div>
		<!-- 选择消息弹窗 -->
		<a-modal :visible="showVisible" title="选择素材" @ok="handleOk" @cancel="handleCancel" width="888">
			<div style="height: 600px;width: 860px;background-color: #FFFFFF;" class="choose-msg">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<a-layout>
						<a-layout-sider>
							<FileMenuModal @changeGroupId='changeGroup' :comefrom="comefrom" :fileType='type'
							          ref="filemenu"></FileMenuModal>
						</a-layout-sider>
						<a-layout-content>
							<div style="background-color: rgb(255, 255, 255);min-height: calc(100% - 10px);padding: 10px;margin-top: 10px;">
								<!-- 图片 -->
								<div v-if="type == 1">
									<div style="overflow: hidden;margin-top: 10px;">
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
<!--										<a-button @click="showModal" style="float: right;">-->
<!--											<a-icon type="cloud-upload"/>-->
<!--											本地上传-->
<!--										</a-button>-->
										<!--										<div style="color:rgb(153, 153, 153);float: left;height: 32px;line-height: 32px;margin-left: 15px;">-->
										<!--											请确保您选择的图片不会有版权纠纷，建议尺寸200px*200px以上-->
										<!--										</div>-->
									</div>
									<div style="width: 100%;margin-top: 100px;"
									     v-show="materialList.length == 0?true:false">
										<img src="../../assets/null.png"
										     style="width: 100px;display: block;margin: auto;"/>
										<p style="text-align: center;">暂无数据</p>
									</div>
									<div style="margin-top: 15px;overflow: hidden;margin-left: 10px;">
										<div v-for="(item,index) in materialList" :key="item.id" class="imgSize"
										     :class="choose(index)?'active' :''" @click="chooseArt(item.id,index)">
											<!--											<a-popover>-->
											<!--												<template slot="content">-->
											<!--													素材来源：{{item.group_name}}-->
											<!--												</template>-->
											<!--												<div class="imgSize-title">素材来源：{{item.group_name}}</div>-->
											<!--											</a-popover>-->
											<div class="imgSize-img"><img
													v-lazy="commonUrl+ (item.s_local_path || item.local_path)" alt="">
											</div>
											<div
													style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -10px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
											>{{item.file_name}}
											</div>
										</div>
									</div>
									<!-- 图片分页 -->
									<div style="width: 100%;margin-top: 12px;">
										<div class="pagination" style="height: 32px;">
											<a-pagination size="small" :total="total" showSizeChanger
											              :showQuickJumper="quickJumper"
											              :current="page"
											              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
											              @change="changePage"
											              @showSizeChange="showSizeChange"/>
										</div>
									</div>
								</div>
								<!-- 音频、视频 -->
								<div v-if="type == 2 || type == 3">
									<div style="overflow: hidden;margin: 10px 0;">
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
<!--										<a-button @click="showModalVoice" style="float: right;" v-if="type == 2">-->
<!--											<a-icon type="cloud-upload"/>-->
<!--											本地上传-->
<!--										</a-button>-->
<!--										<a-button @click="showModalVideo" style="float: right;" v-if="type == 3">-->
<!--											<a-icon type="cloud-upload"/>-->
<!--											本地上传-->
<!--										</a-button>-->
									</div>
									<a-table :columns="columns" :dataSource="materialList" :pagination="false"
									         :rowClassName="rowClassName"
									         :rowSelection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange,type:'checkbox'}">
										<template slot="file_name" slot-scope="text, record, index">
											<template v-if="type == 2">
												<img src="../../assets/yuyin.png" style="width:16px;height:17px;">
												{{record.file_name}}
											</template>
											<a v-if="type == 3" :href="commonUrl+record.local_path"
											   target="view_window">{{record.file_name}}</a>
										</template>
									</a-table>
									<!-- 音频分页 -->
									<div style="width: 100%;margin-top: 20px;bottom:0;" v-show="total > 0">
										<div class="pagination" style="height: 32px;float: right;">
											<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
											              :current="page"
											              size="small"
											              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
											              @change="changePage"
											              @showSizeChange="showSizeChange"/>
										</div>
									</div>
								</div>
								<!-- 小程序 -->
								<div v-if="type == 7">
									<div style="overflow: hidden;margin-top: 10px;">
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
<!--										<a-button @click="showAppletModal" style="float: left;">-->
<!--											<a-icon type="cloud-upload"/>-->
<!--											本地上传-->
<!--										</a-button>-->
										<a-radio-group style="margin-left: 20px;" name="radioGroup"
										               v-model="appletType">
											<a-radio :value="1">文字</a-radio>
											<a-radio :value="2">图片</a-radio>
											<a-radio :value="3">卡片</a-radio>
											<a-radio :value="4">小程序码</a-radio>
										</a-radio-group>
									</div>
									<div
											style="margin: 100px;height: 400px;text-align: center;"
											v-show="materialList.length == 0?true:false"
									>
										<img
												src="../../assets/null.png"
												style="width: 150px;display: block;margin: auto;"
										/>
										<p style="text-align: center;">暂无数据</p>
									</div>
									<!--										:id="item5.id" draggable="true" @dragstart="drag"-->
									<div style="margin-top: 15px;overflow: hidden;">
										<div v-for="(item,index) in materialList" :key="item.id" class="imgSize"
										     :class="choose(index) ?'active' :''" @click="chooseArt(item.id,index)">
											<a-popover>
												<template slot="content">
													素材来源：{{item.group_name}}
												</template>
												<div class="imgSize-title">素材来源：{{item.group_name}}</div>
											</a-popover>
											<!--									<div style="width: 90%;margin:auto;">-->
											<!--										上传者：{{item.username}}-->
											<!--									</div>-->
											<!--									<div style="width: 90%;margin:auto; color: rgba(0,0,0, 0.2)">-->
											<!--										新增于{{item.create_time}}-->
											<!--									</div>-->
											<a-card
													hoverable
													style="width: 90%;margin:auto;"
													:title="item.file_name"
											>
												<img
														alt="example"
														:src="commonUrl+(item.s_local_path || item.local_path)"
														slot="cover"
														style="width: 120px; height: 90px; margin: 0 auto;"
												/>
												<div style="color: rgba(0,0,0,0.5); margin-left: 10px;">
													<MyIcon type="icon-miniapp"></MyIcon>
													<!--													<a-icon type="link"/>-->
													小程序
												</div>
											</a-card>
										</div>
									</div>
									<!-- 小程序分页 -->
									<div style="width: 100%;padding: 0 20px 20px;" v-show="total>0">
										<div class="pagination" style="height: 32px;float: right;">
											<a-pagination
													size="small"
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
							</div>
						</a-layout-content>
					</a-layout>
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
								上传图片
							</template>
							<p style="margin-top: 1em;">
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
								<span style="color: #AAA;font-size: 12px;display: inline-block;vertical-align: bottom;">（图片大小不超过2M，支持JPG、JPEG及PNG格式）</span>
							</p>
						</a-form-item>
						<a-form-item label="素材同步" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
						             style="padding-top: 15px;">
							<a-radio-group @change="changePicMaterialSync" v-model="materialPicSync">
								<a-radio :value="0">不同步</a-radio>
								<a-radio :value="1">同步至【内容引擎】
									<span v-show="materialPicSync == 1">
														选择分组：
													<a-tree-select
															style="width: 225px"
															:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
															:treeData="groupList1"
															placeholder='Please select'
															treeDefaultExpandAll
															v-model="selectPicGroupId"
													>
													</a-tree-select>
													</span>
								</a-radio>
							</a-radio-group>
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
							<template slot="label"><span
									style="color: red">* </span>填写标题
							</template>
							<a-input v-model="voiceTitle"
							         :maxLength="64">
					<span slot="suffix">
						<span>{{voiceTitle.length}}</span>/64
                    </span>
							</a-input>
						</a-form-item>
						<a-form-item :label-col="{ span: 3 }"
						             :wrapper-col="{ span: 21 }" style="margin-top: 20px;">
							<template slot="label">
								<span style="color: red">* </span>上传音频
							</template>
							<!-- 文件未选中 -->
							<a-upload
									v-if="!voiceUrl"
									name="avatar"
									listType="picture-card"
									class="avatar-uploader"
									:showUploadList="false"
									action=""
									:beforeUpload="beforeUploadVoice"
									:customRequest="selfUploadVoice"
							>
								<!--					<div v-if="voiceName">-->
								<!--						<span style="display: inline-block;margin-top: 30px;">{{voiceName}}</span>-->
								<!--					</div>-->
								<div style="padding-top: 25px;">
									<a-icon type="plus"/>
									<div class="ant-upload-text">点击上传</div>
								</div>
							</a-upload>
							<span style="vertical-align: bottom;" v-if="!voiceUrl">（音频上传大小不超过2MB，播放长度不超过60s，支持AMR、MP3格式。）</span>
							<div class="audio" style="display: inline-block;width: 100px;" v-if="voiceUrl"
							     @click="playMusic1()">
								<div class="box" style="float: left;">
									<div class="wifi-symbol" v-if="!playVoice">
										<div class="wifi-circle first"></div>
										<div class="wifi-circle second"></div>
										<div class="wifi-circle third"></div>
									</div>
									<div class="wifi-symbol" v-if="playVoice">
										<div class="wifi-circle first"></div>
										<div class="wifi-circle second1"></div>
										<div class="wifi-circle third1"></div>
									</div>
									<audio ref="audio1" @canplay="oncanplay1">
										<source
												:src="voiceUrl"
												type="audio/mp3"
										/>
									</audio>
									<!--						<div v-if="voiceName">-->
									<!--							<span style="display: inline-block;margin-top: 36px;">{{voiceName}}</span>-->
									<!--						</div>-->
									<div style="text-align: left;width: 100px;line-height: 10px;margin-top: 60px;">
										{{playVoiceTime | dateFormat}}
									</div>
								</div>
							</div>
							<!--				音频重新上传-->
							<a-upload
									v-if="voiceUrl"
									:showUploadList="false"
									action=""
									:beforeUpload="beforeUploadVoice"
									:customRequest="selfUploadVoice"
							>
								<!--					<div v-if="voiceName">-->
								<!--						<span style="display: inline-block;margin-top: 30px;">{{voiceName}}</span>-->
								<!--					</div>-->
								<div style="cursor: pointer;">
									<div class="ant-upload-text;">重新上传</div>
								</div>
							</a-upload>
						</a-form-item>
						<a-form-item label="素材同步" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
						             style="padding-top: 15px;">
							<a-radio-group @change="changeaudioMaterialSync" v-model="materialAudioSync">
								<a-radio :value="0">不同步</a-radio>
								<a-radio :value="1">同步至【内容引擎】
									<span v-show="materialAudioSync == 1">
														选择分组：
													<a-tree-select
															style="width: 225px"
															:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
															:treeData="groupList1"
															placeholder='Please select'
															treeDefaultExpandAll
															v-model="selectAudioGroupId"
													>
													</a-tree-select>
													</span>
								</a-radio>
							</a-radio-group>
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
							<template slot="label"><span
									style="color: red">*</span>填写标题
							</template>
							<a-input v-model="videoTitle"
							         :maxLength="64">
					<span slot="suffix">
						<span>{{videoTitle.length}}</span>/64
                    </span>
							</a-input>
						</a-form-item>
						<a-form-item :label-col="{ span: 3 }"
						             :wrapper-col="{ span: 21 }" style="margin-top: 20px;">
							<template slot="label">
								上传视频
							</template>
							<!-- 文件未选中 -->
							<a-upload
									v-if="!videoUrl"
									name="avatar"
									listType="picture-card"
									class="avatar-uploader"
									:showUploadList="false"
									action=""
									:beforeUpload="beforeUploadVideo"
									:customRequest="selfUploadVideo"
							>
								<div style="padding-top: 25px;">
									<a-icon type="plus"/>
									<div class="ant-upload-text">点击上传</div>
								</div>
							</a-upload>
							<span style="vertical-align: bottom;" v-if="!videoUrl">（视频上传大小不超过10M，支持MP4格式。）</span>
							<video-player
									style="width: 200px;"
									v-if='videoUrl'
									class="video-player vjs-custom-skin"
									ref="videoPlayer"
									:playsinline="true"
									:options="playerVideoOptions"
							></video-player>
							<a-upload
									v-if="videoUrl"
									:showUploadList="false"
									action=""
									:beforeUpload="beforeUploadVideo"
									:customRequest="selfUploadVideo"
							>
								<div style="cursor: pointer;">
									<div class="ant-upload-text;">重新上传</div>
								</div>
							</a-upload>
						</a-form-item>
						<a-form-item label="素材同步" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
						             style="padding-top: 15px;">
							<a-radio-group @change="changeVideoMaterialSync" v-model="materialVideoSync">
								<a-radio :value="0">不同步</a-radio>
								<a-radio :value="1">同步至【内容引擎】
									<span v-show="materialVideoSync == 1">
														选择分组：
													<a-tree-select
															style="width: 225px"
															:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
															:treeData="groupList1"
															placeholder='Please select'
															treeDefaultExpandAll
															v-model="selectVideoGroupId"
													>
													</a-tree-select>
													</span>
								</a-radio>
							</a-radio-group>
						</a-form-item>
					</a-modal>

					<!-- 添加小程序弹窗 -->
					<a-modal v-model="miniprogramVisible" title="新建小程序素材" width="720px;"
					         @cancel="cancelUploadMiniprogram">
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
						<div style="width: 60%; float: left">
							<div style="margin-left: 18px;margin-bottom: 10px;">点击小程序卡片会打开小程序路径指定的页面</div>
							<a-form-item :label-col="{ span: 6 }"
							             :wrapper-col="{ span: 18 }">
								<template slot="label">
									<span style="color: red">* </span>小程序appID
								</template>
								<a-input v-model="miniprogram1.appId"></a-input>
							</a-form-item>
							<a-form-item :label-col="{ span: 6 }"
							             :wrapper-col="{ span: 18 }">
								<template slot="label">
									<span style="color: red">* </span>小程序路径
								</template>
								<a-input v-model="miniprogram1.linkUrl"></a-input>
							</a-form-item>
							<a-form-item :label-col="{ span: 6 }"
							             :wrapper-col="{ span: 18 }">
								<template slot="label">
									<span style="color: red">* </span>卡片标题
								</template>
								<a-input v-model="miniprogram1.title"
								         :maxLength="16">
						<span slot="suffix">
							<span>{{miniprogram1.title.length}}</span>/16
	                    </span>
								</a-input>
							</a-form-item>
							<!-- 选中前 -->
							<a-form-item :label-col="{ span: 6 }"
							             :wrapper-col="{ span: 18 }"
							             v-show="!miniprogram1.material_id">
								<template slot="label">
									<span style="color: red">* </span>卡片图片
								</template>
								<div style="color: rgba(0, 0, 0, 0.4);">图片尺寸建议为520*416像素，文件大小限制为2M</div>
								<div class="upload-wrap"
								     @click="openShowModal(-1)">
									<a-icon type="plus" class="upload-plus"/>
								</div>
							</a-form-item>
							<!-- 选中后 -->
							<a-form-item label="图片封面" :label-col="{ span: 6 }"
							             :wrapper-col="{ span: 18 }"
							             v-show="miniprogram1.material_id">
								<div class="upload-wrap">
									<img :src="miniprogram1.local_path.img" alt=""
									     style="max-width: 100%;max-height: 100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);">
								</div>
								<span
										style="color: blue;cursor: pointer;"
										@click="openShowModal(-1,miniprogram1.material_id)">重新上传</span>
							</a-form-item>
							<a-form-item label="素材同步" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
							             style="padding-top: 15px;">
								<a-radio-group @change="changeAppletMaterialSync" v-model="materialAppletSync">
									<a-radio :value="0">不同步</a-radio>
									<a-radio :value="1">同步至【内容引擎】
										<span v-show="materialAppletSync == 1">
														选择分组：
													<a-tree-select
															style="width: 225px"
															:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
															:treeData="groupList1"
															placeholder='Please select'
															treeDefaultExpandAll
															v-model="selectAppletGroupId"
													>
													</a-tree-select>
													</span>
									</a-radio>
								</a-radio-group>
							</a-form-item>
						</div>
						<div style="float: right; width: 40%;">
							<div style="margin: 0 auto; vertical-align: middle; width: 240px; height: 284px; border: 1px solid #E2E2E2;border-radius: 3px;">
								<p style="padding: 5px 10px 0px 10px; margin-bottom: 0px;height: 35px; line-height: 35px;">
									<img style="width: 18px;height: 18px; border-radius: 50%;"
									     src="../../assets/pigcms.png"/>
									<span style="margin-left: 5px; font-size: 12px; color: rgba(0,0,0,0.4)">轻小店</span>
								</p>
								<p style="padding: 5px 10px 0px 10px;margin-bottom: 0px;">这里有很多优惠哦~~</p>
								<div style="padding: 5px 10px 0px 10px;">
									<img src="../../assets/fileicon.png" style="width: 220px;height: 182px"/>
								</div>
								<div style="padding: 2px 10px;border-top: 1px solid #E2E2E2;margin-top: 8px;">
									<MyIcon type="icon-miniapp"></MyIcon>
									<!--									<a-icon type="link"></a-icon>-->
									<span style="margin-left: 5px">小程序</span>
								</div>
							</div>
							<div style="margin: 0;text-align: center;margin-top: 10px;">示例</div>
						</div>
					</a-modal>

					<ChoosePic :show="showModal3"
					           :callback="modalVisibleChange2" :groupId=selectGroupId type="1"
					           :chooseId="chooseId1"></ChoosePic>
				</a-spin>
			</div>
		</a-modal>
	</div>
</template>

<script>
	import axios from "axios";
	import {videoPlayer} from "vue-video-player"
	import vuedraggable from "vuedraggable";
	import MyIcon from "@/components/MyIcon.vue"
	import editor from "vue2-medium-editor";
	import FileMenuModal from '../foldMenu/FileMenuModal'
	import ChoosePic from "@/components/ChoosePic.vue"

	const columns = [
		{
			title      : '名称',
			dataIndex  : 'file_name',
			key        : 'file_name',
			width      : '30%',
			scopedSlots: {customRender: "file_name"}
		},
		{
			title    : '素材来源',
			dataIndex: 'group_name',
			key      : 'group_name'
		},
		{
			title    : '创建时间',
			dataIndex: 'create_time',
			key      : 'create_time',
		}
	];
	const CancelToken = axios.CancelToken
	const source = CancelToken.source()

	function getBase64 (img, callback) {
		const reader = new FileReader();
		reader.addEventListener("load", () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	export default {
		name      : "ChooseMsg",
		components: {
			videoPlayer, FileMenuModal, ChoosePic, MyIcon
		},
		props     : {
			show       : {
				type   : Boolean,
				default: false
			},
			type       : {
				type   : [Number, Array],
				default: 0
			},
			news_type  : {
				type   : Number,
				default: 0
			},
			chooseId   : {
				type   : Number,
				default: 0
			},
			needConfirm: {
				type   : Boolean,
				default: false
			},
			callback   : {
				type   : Function,
				default: null
			},
			comefrom   : {
				type   : String,
				default: '2'
			},
			clearGroup : {
				type   : Boolean,
				default: false
			},
		},
		data () {
			return {
				name              : '',
				miniprogram1      : {
					appId      : '',
					linkUrl    : '',
					title      : '',
					material_id: '',
					local_path : {
						img  : require('../../assets/img.png'),
						audio: ""
					},
				}, // 上传小程序
				appletType        : 1,   // 小程序类型 1、文字 2、图片 3、卡片 4、小程序码
				miniprogramVisible: false, // 上传小程序弹窗显示
				currentSketch     : 0,  // -1 小程序图片封面 非-1 当前选中的图文封面
				showModal3        : false, // 封面图片
				chooseIds         : [],
				chooseId1         : 0, // 封面id
				lastType          : 0, // 上次选择的
				showVisible       : false, //弹窗显示与隐藏
				materialList      : [], //获取素材数组
				isLoading         : false,//加载的显示与隐藏
				col               : 3,//图文瀑布流分几列
				headers           : {
					authorization: 'authorization-text',
				},
				id                : 0,//选中的素材id值
				choseItem         : [], // 选中的素材item
				//表格部分
				columns,
				//分页
				page              : 1, //页数
				pageSize          : 15, //每页个数
				total             : 0, //总条数
				quickJumper       : false, // 是否显示快速跳转的控件
				commonUrl         : this.$store.state.commonUrl,//公共的链接
				selectedRowKeys   : [],
				groupList         : [], // 小组列表
				groupList1        : [], // 同步素材选择分组
				selectGroupId     : [],// 上传选择的分组id
				material_type     : '6', //4图文，1图片，2音频，3视频, 7小程序，5文件，6文本
				//上传图片弹窗
				visible2          : false, //上传图片弹窗显示与隐藏
				loading4          : false, //上传图片弹窗加载显示与隐藏
				imageUrl          : "",//上传图片的url
				defaultValue      : 1, //默认上传素材类型，1为永久，0为临时
				fileInfo          : {}, //上传图片的文件信息
				materialPicSync   : 0,//0不同步，1同步
				selectPicGroupId  : '',//上传图片的分组id
				//上传音频弹窗
				voiceVisible      : false, // 上传音频弹窗显示与隐藏
				voiceTitle        : '',//音频标题
				voiceName         : '', // 音频文件名称
				voiceUrl          : '', // 音频src
				playVoice         : false,
				t2                : '', // 上传音频播放计时器参数
				playVoiceTime     : '',
				materialAudioSync : 0,//0不同步，1同步
				selectAudioGroupId: '',//上传音频的分组id
				//上传视频弹窗
				videoVisible      : false, // 上传音频弹窗
				playerVideoOptions: {}, // 视频播放配置
				videoTitle        : '', // 上传视频标题
				videoUrl          : '', // 视频src
				materialVideoSync : 0,//0不同步，1同步
				selectVideoGroupId: '',//上传音频的分组id

				materialAppletSync : 0,
				selectAppletGroupId: ''
			};
		},
		computed  : {
			itemWidth () {
				return 270
			},
			gutterWidth () {
				return 10
			}
		},
		methods   : {
			choose (index) {
				for (let i = 0; i < this.chooseIds.length; i++) {
					if (this.materialList[index].id == this.chooseIds[i]) {
						return true
					}
				}
				return false
			},
			//小程序弹窗
			showAppletModal () {
				this.getGroupList()
				this.miniprogram1 = {
					appId      : '',
					linkUrl    : '',
					title      : '',
					material_id: '',
					local_path : {
						img  : require('../../assets/img.png'),
						audio: ''
					}
				}
				this.material_type = 7
				this.miniprogramVisible = true
			},
			cancelUploadMiniprogram () {
				this.miniprogramVisible = false
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
				if (!this.miniprogram1.material_id) {
					this.$message.warning('请选择卡片图片！')
					return false
				}
				let data = {
					appId    : this.miniprogram1.appId,
					appPath  : this.miniprogram1.linkUrl,
					title    : this.miniprogram1.title,
					attach_id: this.miniprogram1.material_id,
					pic_url  : this.miniprogram1.local_path.img,
				}
				this.uploadMaterial(data)
			},
			//打开上传页面
			openShowModal (sketchIndex, id) {
				if (typeof id == 'undefined') {
					this.chooseId1 = 0
				} else {
					this.chooseId1 = Number(id)
				}
				this.currentSketch = sketchIndex
				this.miniprogramVisible = false
				this.showModal3 = true
			}
			,
			// 选择图片弹窗回调
			modalVisibleChange2 (event, e, id, url) {
				let that = this
				if (event == "ok") {
					if (isNaN(id) || id == '') {
						this.$message.error('请选择素材')
						this.showModal3 = false
					} else {

						if (this.currentSketch == -1) {
							that.showModal3 = false
							that.miniprogramVisible = true
							that.miniprogram1.material_id = id
							that.miniprogram1.local_path.img = that.commonUrl + url
						}
					}
				} else {
					this.showModal3 = false
					if (this.currentSketch == -1) {
						this.miniprogramVisible = true
					}
				}
			},
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			handleOk (e) {
				if (this.chooseIds.length !== 0) {
					this.showVisible = false;
					if (this.callback !== null && typeof this.callback === "function") {
						if (this.needConfirm) {
							let _this = this
							this.$confirm({
								title  : '确定选择这个吗？',
								content: h => h('div',
									[
										h('img', {
											attrs: {
												src: this.$store.state.commonUrl + this.choseItem.local_path
											},
											style: {
												maxWidth : '100%',
												maxHeight: '300px',
												marginTop: '10px'
											}
										})
									]),
								onOk () {
									_this.callback("ok", e, _this.chooseIds, _this.choseItem, this.appletType);
								},
								onCancel () {
									_this.showVisible = true;
								},
								class  : 'choose-confirm-modal',
							});
						} else {
							this.callback("ok", e, this.chooseIds, this.choseItem, this.appletType);
						}
					}
				} else {
					this.$message.warning('请选择素材')
				}
			},
			handleCancel (e) {
				if (this.callback !== null && typeof this.callback === "function") {
					this.callback("cancel", e);
				}
				this.showVisible = false;
			},
			//获取素材
			async getMaterial (page = 1, pageSize = this.pageSize) {
				this.id = 0
				this.selectedRowKeys = []
				this.isLoading = true
				const {data: res} = await this.axios.post("attachment/list", {
					uid      : localStorage.getItem('uid'),
					comefrom : this.comefrom,
					group_id : this.selectGroupId,
					file_type: this.type,
					news_type: this.news_type,
					page     : page,
					pageSize : pageSize,
					name     : this.name
				});
				if (res.error == 0) {
					this.isLoading = false
					if (this.type == 4) {
						if (this.news_type == 1) {
							this.materialList = res.data.attachment.single.list;
							this.total = parseInt(res.data.attachment.single.count);
						} else if (this.news_type == 2) {
							this.materialList = res.data.attachment.double.list;
							this.total = parseInt(res.data.attachment.double.count);
						} else {
							var a = res.data.attachment.single.list
							var b = res.data.attachment.double.list
							this.materialList = a.concat(b)
							this.total = parseInt(res.data.count);
						}
					} else {
						this.materialList = res.data.attachment
						this.total = parseInt(res.data.count);
					}
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;

					if (this.chooseId != this.id) {
						this.id = this.chooseId
						this.selectedRowKeys = []
						this.selectedRowKeys.push(this.chooseId.toString())
					}
				} else {
					this.isLoading = false
					this.$message.error(res.error_msg);
				}
				// console.log(res,222);
			},
			//改变分组
			changeGroup (e) {
				this.selectGroupId = e
				this.getMaterial()
			},
			onSearch (value) {
				this.name = value;
				this.materialList = []
				this.page = 1
				this.pageSize = 15
				this.getMaterial(this.page, this.pageSize);
			},
			// 清空按钮
			clearInput () {
				this.name = "";
				this.materialList = []
				this.page = 1
				this.pageSize = 15
				this.getMaterial(this.page, this.pageSize);
			},
			scroll (scrollData) {
				// console.log(scrollData)
			},
			loadmore (index) {
				this.materialList = this.materialList.concat(this.materialList)
			},
			//上传图片素材弹窗
			showModal () {
				this.imageUrl = ''
				this.fileInfo = {}
				this.visible2 = true;
				this.material_type = 1
				this.showVisible = false
			},
			uploadPic () {
				this.loading4 = true;
				if (!this.fileInfo.uid) {
					this.$message.warning('请选择图片！')
					this.loading4 = false
					return false
				}
				this.uploadMaterial(this.fileInfo);
			},
			cancelUploadPic () {
				if (this.loading4) {
					source.cancel()
				}
				this.visible2 = false;
				this.defaultValue = 1;
				this.imageUrl = "";
				this.materialPicSync = 0
				this.selectPicGroupId = ''
				this.showVisible = true
			},
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
				const isLt2M = file.size / 1024 / 1024 <= 2;
				if (!isLt2M) {
					this.$message.error("图片不超过2M！");
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				return isLt2M;
			},
			changePicMaterialSync () {
				this.selectPicGroupId = this.groupList1[0].key
			},

			// 上传音频
			showModalVoice () {
				this.voiceTitle = ''
				this.voiceName = ''
				this.voiceUrl = ''
				this.playVoiceTime = ''
				this.fileInfo = {}
				this.voiceVisible = true
				this.material_type = 2
				this.showVisible = false
			},
			uploadVoice () {
				this.loading4 = true;
				if (!this.voiceTitle) {
					this.$message.warning('请填写标题！')
					this.loading4 = false
					return false
				}
				if (!this.fileInfo.uid) {
					this.$message.warning('请选择音频！')
					this.loading4 = false
					return false
				}
				let data = {
					name    : this.voiceTitle,
					fileInfo: this.fileInfo
				}
				this.uploadMaterial(data);
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
				this.materialAudioSync = 0
				this.selectAudioGroupId = ''
				this.showVisible = true
			},
			selfUploadVoice ({action, file, onSuccess, onError, onProgress}) {
				let that = this
				const base64 = new Promise(resolve => {
					const fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					this.voiceName = file.name
					fileReader.onload = () => {
						that.voiceUrl = fileReader.result
						that.$refs.audio1.src = fileReader.result
						resolve(fileReader.result);
					};
				});

				this.fileInfo = file;
			},
			beforeUploadVoice (file) {
				if (this.comefrom == 1) {
					if (file.type != 'audio/amr') {
						this.$message.error("音频类型仅支持AMR类型！");
						return false;
					}
				} else {
					if (file.type != 'audio/mp3' && file.type != 'audio/amr' && file.type != 'audio/mpeg') {
						this.$message.error("音频类型仅支持AMR、MP3类型！");
						return false;
					}
				}
				const isLt2M = file.size / 1024 / 1024 <= 2;
				if (!isLt2M) {
					this.$message.error("音频不超过2M！");
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				this.playVoice = false
				clearInterval(this.t2);
				return isLt2M;
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
			changeaudioMaterialSync () {
				this.selectAudioGroupId = this.groupList1[0].key
			},

			// 上传视频
			showModalVideo () {
				this.videoTitle = ''
				this.fileInfo = {}
				this.videoUrl = ''
				this.playerVideoOptions = {}
				this.videoVisible = true
				this.material_type = 3
				this.showVisible = false
			},
			uploadVideo () {
				this.loading4 = true;
				if (!this.videoTitle) {
					this.$message.warning('请填写标题！')
					this.loading4 = false
					return false
				}
				if (!this.fileInfo.uid) {
					this.$message.warning('请选择视频！')
					this.loading4 = false
					return false
				}
				let data = {
					name    : this.videoTitle,
					fileInfo: this.fileInfo
				}
				this.uploadMaterial(data);
			},
			cancelUploadVideo () {
				if (this.loading4) {
					source.cancel()
				}
				this.videoVisible = false
				this.materialVideoSync = 0
				this.selectVideoGroupId = ''
				this.showVisible = true
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
			changeVideoMaterialSync () {
				this.selectVideoGroupId = this.groupList1[0].key
			},
			changeAppletMaterialSync () {
				this.selectAppletGroupId = this.groupList1[0].key
			},
			// 上传素材
			async uploadMaterial (materialData) {
				this.loading4 = true
				let params = {
					uid            : localStorage.getItem('uid'),
					sub_id         : localStorage.getItem('sub_id'),
					isMasterAccount: localStorage.getItem('isMasterAccount'),
				}
				if (this.material_type == 1) {
					//图片
					params = new FormData();
					params.append("uid", localStorage.getItem('uid'));
					params.append("sub_id", localStorage.getItem('sub_id'));
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("file_type", this.material_type);
					params.append("fileInfo", materialData);
					params.append("is_sync", this.materialPicSync);
					if (this.materialPicSync == 1) {
						params['group_id'] = this.selectPicGroupId
					}
				} else if (this.material_type == 2) {
					//音频
					params = new FormData();
					params.append("uid", localStorage.getItem('uid'));
					params.append("sub_id", localStorage.getItem('sub_id'));
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("file_type", this.material_type);
					params.append("name", materialData.name);
					params.append("fileInfo", materialData.fileInfo);
					params.append("is_sync", this.materialAudioSync);
					if (this.materialAudioSync == 1) {
						params.append("group_id", this.selectAudioGroupId);
					}
				} else if (this.material_type == 3) {
					//视频
					params = new FormData();
					params.append("uid", localStorage.getItem('uid'));
					params.append("sub_id", localStorage.getItem('sub_id'));
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("file_type", this.material_type);
					params.append("name", materialData.name);
					params.append("fileInfo", materialData.fileInfo);
					params.append("is_sync", this.materialVideoSync);
					if (this.materialVideoSync == 1) {
						params.append("group_id", this.selectVideoGroupId);
					}
				} else if (this.material_type == 5) {
					params = new FormData();
					params.append("uid", localStorage.getItem('uid'));
					params.append("sub_id", localStorage.getItem('sub_id'));
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("file_type", this.material_type);
					params.append("name", materialData.name);
					params.append("fileInfo", this.fileInfo);
					params.append("is_sync", this.materialFileSync);
					if (this.materialVideoSync == 1) {
						params.append("group_id", this.selectVideoGroupId);
					}
				} else if (this.material_type == 7) {
					params['appData'] = materialData
					params['file_type'] = this.material_type
					if (this.materialAppletSync == 1) {
						params['group_id'] = this.selectAppletGroupId
					}
				}
				const {data: res} = await this.axios.post("attachment/add", params, {cancelToken: source.token})
				if (res.error == 0) {
					this.id = res.data.attachment_id
					//图片
					this.visible2 = false
					this.materialPicSync = 0
					this.selectPicGroupId = ''
					//音频
					this.voiceVisible = false
					this.materialAudioSync = 0
					this.selectAudioGroupId = ''
					//视频
					this.videoVisible = false
					this.materialVideoSync = 0
					this.selectVideoGroupId = ''
					// 小程序
					this.miniprogramVisible = false
					this.materialAppletSync = 0
					this.selectAppletGroupId = ''
					let chooseIds = []
					chooseIds.push(this.id)
					if (this.material_type == '7') {
						let chooseItem = []
						chooseItem.push(materialData)
						this.callback("ok", '', chooseIds, chooseItem, this.appletType);
					} else {
						let chooseItem = []
						chooseItem.push(res.data.info)
						this.callback("ok", '', chooseIds, chooseItem);
					}
					this.loading4 = false
					this.showVisible = false
				} else {
					this.$message.error(res.error_msg)
					this.loading4 = false
				}
			},

			//选择图文、图片素材
			chooseArt (id, index) {
				let i = this.chooseIds.findIndex((x) => x == id)
				if (i == -1) {
					this.chooseIds.push(id)
					this.choseItem.push(this.materialList[index])
				} else {
					this.chooseIds.splice(i, 1)
					this.choseItem.splice(i, 1)
				}
				// this.id = parseInt(id)
				// this.choseItem = this.materialList[index]
			},
			//选择音频素材、视频素材
			onSelectChange (id, selectedRows) {
				this.chooseIds = id
				this.choseItem = selectedRows
				this.selectedRowKeys = id
			},
			// 分页
			changePage (page, pageSize) {
				this.getMaterial(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.getMaterial(1, pageSize);
			},
			//获取分组列表
			async getGroupList () {
				let params = {
					uid: localStorage.getItem('uid'),
				}
				if(this.type != 1) {
					params["is_channel"] = 1
				}
				const {data: res} = await this.axios.post("attachment/group", params);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					this.groupList1 = JSON.parse(JSON.stringify(res.data.group))
					let g = {
						key         : "",
						value       : "0",
						parent_id   : null,
						title       : "所有",
						sort        : 0,
						is_not_group: 0,
						scopedSlots : {
							title: "custom"
						},
						children    : []
					}
					this.groupList.splice(0, 0, g)
				}
			},
		},

		watch: {
			show (newValue) {
				this.name = ''
				this.showVisible = newValue;
				this.appletType = 1
				this.choseItem = [];
				this.chooseIds = []
				if (this.show) {
					if (this.clearGroup) {
						this.selectGroupId = []
					}
					if (this.lastType != this.type) {
						this.lastType = this.type
						this.selectGroupId = []
					}
					this.getMaterial();
					this.getGroupList()
					this.isLoading = true
				}
				// if (this.chooseId != this.id) {
				// 	this.id = this.chooseId
				this.selectedRowKeys = []
				// this.selectedRowKeys.push(this.chooseIds.toString())
				// }
			},
			chooseId (newValue) {
				if (newValue != this.id) {
					this.id = newValue;
					let a = this.id.toString()
					this.selectedRowKeys = []
					this.selectedRowKeys.push(a)
				}
			},
			// type (newValue) {
			// 	if (this.lastType != newValue) {
			// 		this.materialList = []
			// 		this.lastType = newValue
			// 		this.selectGroupId = []
			// 	}
			// }
		},

		created () {
		}
	};
</script>

<style lang='less' scoped>
	/deep/ .ant-layout-sider {
		background: #FFF;
		flex: 0 0 250px !important;
		max-width: 250px !important;
		min-width: 250px !important;
		width: 250px !important;
		border-right: 1px solid #E2E2E2;
	}

	/deep/ .ant-layout-content {
		margin: 0 10px 10px;
		min-width: 450px;
		width: 100%;
		/*padding-right: 40px;*/
	}

	.content-hd {
		display: inline-block;
		padding: 0;
		margin: 0;
		text-align: left;
	}

	.fileSize {
		background-color: #FFF;
		float: left;
		width: 150px;
		height: 120px;
		margin-bottom: 15px;
		margin-right: 13px;
		overflow: hidden;
		border: 1px solid #E9E9E9;
		cursor: pointer;
		border-radius: 6px;
		position: relative;

		.fileSize-title {
			color: #999;
			height: 22px;
			line-height: 22px;
			font-size: 14px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			border-bottom: 1px solid #E9E9E9;
		}
	}

	.file-name {
		float: right;
		max-width: calc(100% - 70px);
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.imgSize {
		background-color: #FFF;
		float: left;
		width: 172px;
		height: 174px;
		margin-bottom: 15px;
		margin-right: 13px;
		/*display: flex;*/
		/*align-items: center;*/
		/*justify-content: center;*/
		overflow: hidden;
		border: 1px solid #E9E9E9;
		cursor: pointer;
		border-radius: 6px;
		position: relative;

		.imgSize-title {
			color: #999;
			height: 22px;
			line-height: 22px;
			font-size: 14px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			border-bottom: 1px solid #E9E9E9;
		}

		.imgSize-img {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 172px;
			height: 152px;
		}

		img {
			max-width: 100%;
			max-height: 100%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	/*.imgSize:nth-child(5n+0) {*/
	/*	margin-right: 0;*/
	/*}*/

	.active {
		border: 2px solid #3B74FF;
	}

	.active::after {
		content: '';
		width: 20px;
		height: 20px;
		background-image: url(https://s.weituibao.com/static/1544152635969/select.png);
		background-size: 20px 20px;
		position: absolute;
		top: 0;
		right: 0;
	}

	/deep/ .vue-waterfall {
		height: auto !important;
	}

	/deep/ .dark-row {
		background: #FAFAFA;
	}

	/deep/ .light-row {
		background: #FFF;
	}

	/deep/ .ant-spin-nested-loading {
		height: 100%;
	}

	/deep/ .ant-spin-container {
		height: 100%;
	}

	/deep/ .ant-card-head-title {
		padding: 6px 0;
		color: #999;
		font-size: 14px;
	}

	/deep/ .ant-card-head {
		padding: 0 10px;
		min-height: 36px;
		border-bottom: 0;
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

	/deep/ .video-js {
		max-width: 100%;
		height: 112.5px;
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
</style>