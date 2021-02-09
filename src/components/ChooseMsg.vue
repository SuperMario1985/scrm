<template>
	<div>
		<!-- 选择消息弹窗 -->
		<a-modal :visible="showVisible" class="msg-modal" title="选择素材" @ok="handleOk" @cancel="handleCancel"
		         width="888">
			<div style="height: 600px;width: 840px;" class="choose-msg">
				<a-spin tip="Loading..." size="large" :spinning="isLoading && type != 1">
					<a-tree-select
							style="width: 350px"
							:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
							:treeData="groupList"
							placeholder='所有分组'
							v-model="selectGroupId"
							treeDefaultExpandAll
							allowClear
							@change="changeGroup"
					>
					</a-tree-select>
					<a-input-search
							placeholder="输入要搜索的内容"
							@search="onSearch"
							v-model="name"
							:allowClear=true
							enterButton="搜索"
							style="width: 260px;margin-left: 10px;"
					/>
					<a-button @click="clearInput" style="margin-left: 10px;">
						清空
					</a-button>
					<!-- 图文 -->
					<div v-if="type == 1">
						<div style="width: 100%;margin-top: 100px;" v-show="materialList.length == 0?true:false">
							<img src="../assets/null.png" style="width: 100px;display: block;margin: auto;"/>
							<p style="text-align: center;">暂无数据</p>
						</div>
						<div class="container-water-fall">
							<waterfall
									:col="col"
									:width="itemWidth"
									:data="materialList"
									:gutterWidth="gutterWidth"
									@loadmore="loadmore"
									@scroll="scroll">
								<template>
									<a-card hoverable v-for="(item,index) in materialList" :key="index"
									        :class="materialList[index].id == id?'active' :''"
									        style="margin-top: 10px;cursor: pointer;border-radius: 6px;"
									        @click="chooseArt(item.id,index)">
										<template slot="title">
											<a-popover>
												<template slot="content">
													素材来源：{{item.group_name}}
												</template>
												素材来源：{{item.group_name}}
											</a-popover>
										</template>
										<template v-for="(art, artIndex) in item.artList">
											<template v-if="artIndex == 0">
												<div
														style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -30px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
													{{art.title}}
												</div>
												<img v-if="sketchType == 0" alt="example"
												     style="height: 149px;object-fit: cover;"
												     v-lazy="commonUrl+(art.s_local_path || art.local_path)"
												     slot="cover"/>
												<img v-if="sketchType == 1" alt="example"
												     style="height: 149px;object-fit: contain;"
												     v-lazy="commonUrl+(art.s_local_path || art.local_path)"
												     slot="cover"/>
											</template>
											<template v-if="artIndex != 0">
												<a-card-meta :title="art.title" style="margin: 0;padding: 20px;">
													<a-avatar style="object-fit: cover;" slot="avatar" shape="square"
													          :size="64"
													          :src="commonUrl+(art.s_local_path || art.local_path)"/>
												</a-card-meta>
											</template>
										</template>
									</a-card>
								</template>
							</waterfall>
						</div>
					</div>
					<!-- 图片 -->
					<div v-if="type == 2" style="overflow: hidden;float: right">
						<a-button @click="showModal">
							<a-icon type="cloud-upload"/>
							本地上传
						</a-button>
						<!--							<div style="color:rgb(153, 153, 153);float: left;height: 32px;line-height: 32px;margin-left: 15px;">-->
						<!--								请确保您选择的图片不会有版权纠纷，建议尺寸200px*200px以上-->
						<!--							</div>-->
					</div>
					<div v-if="type == 2" style="margin-top: 20px;">
						<div style="width: 100%;margin-top: 100px;" v-show="materialList.length == 0?true:false">
							<img src="../assets/null.png" style="width: 100px;display: block;margin: auto;"/>
							<p style="text-align: center;">暂无数据</p>
						</div>
						<div style="margin-top: 15px;overflow: hidden;">
							<div v-for="(item,index) in materialList" :key="item.id" class="imgSize"
							     :class="materialList[index].id == id?'active' :''" @click="chooseArt(item.id,index)">
								<a-popover>
									<template slot="content">
										素材来源：{{item.group_name}}
									</template>
									<div class="imgSize-title">素材来源：{{item.group_name}}</div>
								</a-popover>
								<div class="imgSize-img"><img v-lazy="commonUrl+(item.s_local_path || item.local_path)"
								                              style="object-fit: cover;" alt=""></div>
								<div
										style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -32px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
								>{{item.file_name}}
								</div>
							</div>
						</div>
						<!-- 图片分页 -->
						<div style="width: 100%;position: absolute;margin-top: 12px;">
							<div class="pagination" style="height: 32px;float: right;">
								<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
								              :current="page"
								              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
								              @change="changePage"
								              @showSizeChange="showSizeChange"/>
							</div>
						</div>
					</div>
					<!-- 音频、视频 -->
					<div v-if="type == 3 || type == 4" style="overflow: hidden;float: right">
						<a-button @click="showModalVoice" v-if="type == 3">
							<a-icon type="cloud-upload"/>
							本地上传
						</a-button>
						<a-button @click="showModalVideo" style="float: left;" v-if="type == 4">
							<a-icon type="cloud-upload"/>
							本地上传
						</a-button>
					</div>
					<div v-if="type == 3 || type == 4" style="margin-top: 20px;">
						<a-table :columns="columns" :dataSource="materialList" :pagination="false"
						         :rowClassName="rowClassName"
						         :rowSelection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange,type:'radio'}">
							<template slot="file_name" slot-scope="text, record, index">
								<template v-if="type == 3">
									<img src="../assets/yuyin.png" style="width:16px;height:17px;">
									{{record.file_name}}
								</template>
								<a v-if="type == 4" :href="commonUrl+record.local_path"
								   target="view_window">{{record.file_name}}</a>
							</template>
						</a-table>
						<!-- 音频分页 -->
						<div style="width: 100%;margin-top: 20px;bottom:0;" v-show="total > 0">
							<div class="pagination" style="height: 32px;float: right;">
								<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
								              :current="page"
								              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
								              @change="changePage"
								              @showSizeChange="showSizeChange"/>
							</div>
						</div>
					</div>
					<!-- 文件 -->
					<div v-if="type == 5" style="overflow: hidden;float: right;">
						<a-button @click="showModalFile" style="float: left;">
							<a-icon type="cloud-upload"/>
							本地上传
						</a-button>
					</div>
					<div v-if="type == 5" style="margin-top: 20px;">
						<div style="width: 100%;margin-top: 100px;" v-show="materialList.length == 0?true:false">
							<img src="../assets/null.png" style="width: 100px;display: block;margin: auto;"/>
							<p style="text-align: center;">暂无数据</p>
						</div>
						<div style="margin-top: 15px;overflow: hidden;">
							<div v-for="(item,index) in materialList" :key="item.id" class="fileSize"
							     :class="materialList[index].id == id?'active' :''" @click="chooseArt(item.id,index)">
								<a-popover>
									<template slot="content">
										素材来源：{{item.group_name}}
									</template>
									<div class="fileSize-title">素材来源：{{item.group_name}}</div>
								</a-popover>
								<a-card
										hoverable
										style="width: 90%;margin:auto;"
								>
									<div>
										<img
												alt="example"
												style="width: 60px;height: 80px;margin: 0 !important;"
												src="../assets/fileicon.png"
												slot="cover"
										/>
										<div class="file-name">{{item.file_name}}</div>
									</div>
								</a-card>
							</div>
						</div>
						<!-- 图片分页 -->
						<div style="width: 100%;position: absolute;margin-top: 12px;">
							<div class="pagination" style="height: 32px;float: right;">
								<a-pagination :total="total" showSizeChanger :showQuickJumper="quickJumper"
								              :current="page"
								              :pageSize="pageSize" :pageSizeOptions="['15','30','50','100']"
								              @change="changePage"
								              @showSizeChange="showSizeChange"/>
							</div>
						</div>
					</div>
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
								上传文件
							</template>
							<div style="margin: 5px 0px;">
								<a-upload
										v-if="!fileName"
										name="avatar"
										listType="picture-card"
										class="avatar-uploader"
										:showUploadList="false"
										action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
										:beforeUpload="beforeUploadFile"
										:customRequest="selfUploadFile">
									<div style="padding-top: 25px;">
										<a-icon type="plus"/>
										<div class="ant-upload-text">点击上传</div>
									</div>
								</a-upload>
								<span v-if="!fileName"
								      style="float: right;width: 78%;margin-top: 50px;line-height: 26px;">
						（上传文件大小20MB，支持DOC、DOCX、XLS、XLSX、CSV、PPT、PPTX、TXT、PDF及Xmind格式。）
					</span>
								<div style="margin-left: 70px;">
									<div v-if="fileName" alt="avatar">
										{{fileName}}
									</div>
									<a-upload
											v-if="fileName"
											:showUploadList="false"
											action=""
											:beforeUpload="beforeUploadFile"
											:customRequest="selfUploadFile">
										<div style="cursor: pointer;">
											<div class="ant-upload-text;" style="margin-top: 5px; color: #01b065;">
												重新上传
											</div>
										</div>
									</a-upload>
								</div>
							</div>
						</a-form-item>
						<a-form-item label="素材同步" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"
						             style="padding-top: 15px;">
							<a-radio-group @change="changeFileMaterialSync" v-model="materialFileSync">
								<a-radio :value="0">不同步</a-radio>
								<a-radio :value="1">同步至【内容引擎】
									<span v-show="materialFileSync == 1">
														选择分组：
													<a-tree-select
															style="width: 225px"
															:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
															:treeData="groupList1"
															placeholder='Please select'
															treeDefaultExpandAll
															v-model="selectFileGroupId"
													>
													</a-tree-select>
													</span>
								</a-radio>
							</a-radio-group>
						</a-form-item>
					</a-modal>
				</a-spin>
			</div>
			<a-spin class="skethLoading"
			        tip="Loading..."
			        size="large"
			        style="position: absolute;top: 50%; left: 50%; width: 100%;transform: translate(-50%, -50%); padding-top: 35%; height: 100%;background-color: rgba(0, 0, 0, 0); z-index: 99999999999999;"
			        :spinning="isLoading && type == 1">
			</a-spin>
		</a-modal>
	</div>
</template>

<script>
	import axios from "axios";
	import {videoPlayer} from "vue-video-player"

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
		name      : "chooseMsg",
		components: {
			videoPlayer
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
			author_id  : {
				type   : String,
				default: ''
			},
			sketchType : {
				type   : String,
				default: '0'
			}
		},
		data () {
			return {
				name              : '',
				lastType          : 0, // 上次选择的
				showVisible       : false, //弹窗显示与隐藏
				materialList      : [], //获取素材数组
				isLoading         : false,//加载的显示与隐藏
				col               : 3,//图文瀑布流分几列
				headers           : {
					authorization: 'authorization-text',
				},
				id                : 0,//选中的素材id值
				choseItem         : {}, // 选中的素材item
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
				groupList1        : [], // 同步素材小组列表
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
				materialFileSync  : 0,//0不同步，1同步
				selectFileGroupId : '',//上传文件的分组id
				fileVisible       : false, // 上传文件
				fileName          : '',
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
			rowClassName (record, index) {
				let className = 'dark-row';

				if (index % 2 === 0) {
					className = 'light-row';
				}

				return className;
			},
			handleOk (e) {
				if (this.id !== 0) {
					// this.showVisible = false;
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
									_this.callback("ok", e, _this.id, _this.choseItem);
								},
								onCancel () {
									_this.showVisible = true;
								},
								class  : 'choose-confirm-modal',
							});
						} else {
							this.callback("ok", e, this.id, this.choseItem);
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
				// this.showVisible = false;
			},
			//获取素材
			async getMaterial (page = 1, pageSize = this.pageSize) {
				// this.id = 0
				// this.selectedRowKeys = []
				this.isLoading = true
				let type = this.type
				if ((this.comefrom == 0 || this.comefrom == 3) && this.type == 2) {
					type = 1
				}
				const {data: res} = await this.axios.post("attachment/list", {
					uid      : localStorage.getItem('uid'),
					comefrom : this.comefrom,
					group_id : this.selectGroupId,
					file_type: type,
					news_type: this.news_type,
					page     : page,
					pageSize : pageSize,
					wx_id    : this.author_id,
					name     : this.name
				});
				if (res.error == 0) {
					this.isLoading = false
					if (this.type == 1) {
						if (this.news_type == 1) {
							if (page == 1) {
								this.materialList = res.data.attachment.single.list
							} else {
								this.materialList = this.materialList.concat(res.data.attachment.single.list)
							}
						} else if (this.news_type == 2) {
							if (page == 1) {
								this.materialList = res.data.attachment.double.list
							} else {
								this.materialList = this.materialList.concat(res.data.attachment.double.list)
							}
						} else {
							let a = res.data.attachment.single.list
							let b = res.data.attachment.double.list
							if (page == 1) {
								this.materialList = a.concat(b)
							} else {
								this.materialList = this.materialList.concat(a.concat(b))
							}
						}
						this.total = parseInt(res.data.count);
						let that = this
						if (page == 1 && this.type == 1) {
							let msgModalBody = document.getElementsByClassName('msg-modal')[0].getElementsByClassName('ant-modal-body')[0]
							msgModalBody.onscroll = function () {
								//变量scrollTop是滚动条滚动时，距离顶部的距离
								let scrollTop = msgModalBody.scrollTop;
								//变量windowHeight是可视区的高度
								let windowHeight = msgModalBody.clientHeight || document.body.clientHeight;
								//变量scrollHeight是滚动条的总高度
								let scrollHeight = msgModalBody.scrollHeight || document.body.scrollHeight;
								//滚动条到底部的条件
								if (scrollTop + windowHeight == scrollHeight) {
									if (Math.ceil(that.total / 15.0) > that.page) {
										that.getMaterial(that.page + 1, that.pageSize)
									}
								}
							}
						}
					} else {
						this.materialList = res.data.attachment
						this.total = parseInt(res.data.count);
					}
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
				} else {
					this.isLoading = false
					this.$message.error(res.error_msg);
				}
				// console.log(res,222);
			},
			//改变分组
			changeGroup (e) {
				this.selectGroupId = e
				this.materialList = []
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
				// this.materialList = this.materialList.concat(this.materialList)
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

				let isLt2M = file.size / 1024 / 1024 <= 2;
				if (this.comefrom == '3') {
					isLt2M = file.size / 1024 / 1024 <= 1;
				}

				if (!isLt2M) {
					if (this.comefrom == '3') {
						this.$message.error("图片不超过1M！");
					} else {
						this.$message.error("图片不超过2M！");
					}
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
				this.getGroupList1()
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
				this.getGroupList1()
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

			// 上传文件弹窗
			showModalFile () {
				this.getGroupList1()
				this.material_type = 5
				this.fileInfo = {}
				this.fileName = ''
				this.fileVisible = true
			},

			cancelUploadFile () {
				this.fileVisible = false
			},
			uploadFile () {
				this.loading4 = true;
				if (!this.fileInfo.uid) {
					this.$message.warning('请选择文件！')
					this.loading4 = false
					return false
				}
				this.uploadMaterial(this.fileInfo);
			},
			selfUploadFile ({action, file, onSuccess, onError, onProgress}) {
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
			beforeUploadFile (file) {
				const isLt2M = file.size / 1024 / 1024 <= 20;
				if (!isLt2M) {
					this.$message.error("文件不超过20M！");
					return false;
				} else if (file.size <= 5) {
					this.$message.error("上传的文件大小需大于5字节！");
					return false;
				}
				return isLt2M;
			},
			changeFileMaterialSync () {
				this.selectFileGroupId = this.groupList1[0].key
			},
			// 上传素材
			async uploadMaterial (materialData) {
				this.loading4 = true
				let params = {
					uid: localStorage.getItem('uid'),
				}
				if (this.material_type == 1) {
					//图片
					params = new FormData();
					params.append("uid", localStorage.getItem('uid'));
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("sub_id", localStorage.getItem('sub_id'));
					params.append("file_type", this.material_type);
					params.append("fileInfo", materialData);
					params.append("is_sync", this.materialPicSync);
					if (this.materialPicSync == 1) {
						params.append("group_id", this.selectPicGroupId);
					}
				} else if (this.material_type == 2) {
					//音频
					params = new FormData();
					params.append("uid", localStorage.getItem('uid'));
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("sub_id", localStorage.getItem('sub_id'));
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
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("sub_id", localStorage.getItem('sub_id'));
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
					params.append("isMasterAccount", localStorage.getItem('isMasterAccount'));
					params.append("sub_id", localStorage.getItem('sub_id'));
					params.append("file_type", this.material_type);
					params.append("name", materialData.name);
					params.append("fileInfo", this.fileInfo);
					params.append("is_sync", this.materialFileSync);
					if (this.materialVideoSync == 1) {
						params.append("group_id", this.selectVideoGroupId);
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
					// 文件
					this.fileVisible = false
					this.materialFileSync = 0
					this.selectFileGroupId = ''
					this.callback("ok", '', this.id, res.data.info);
					this.loading4 = false
					// this.showVisible = false
				} else {
					this.$message.error(res.error_msg)
					this.loading4 = false
				}
			},

			//选择图文、图片素材
			chooseArt (id, index) {
				this.id = parseInt(id)
				this.choseItem = this.materialList[index]
			},
			//选择音频素材、视频素材
			onSelectChange (id, selectedRows) {
				this.selectedRowKeys = []
				this.id = parseInt(id[0])
				this.choseItem = selectedRows[0]
				this.selectedRowKeys.push(id[0])
			},
			// 分页
			changePage (page, pageSize) {
				this.getMaterial(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.getMaterial(1, pageSize);
			},
			// 获取上传分组列表
			async getGroupList1 () {
				let params = {
					uid       : localStorage.getItem('uid'),
					is_channel: 1
				}
				const {data: res} = await this.axios.post("attachment/group", params);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList1 = JSON.parse(JSON.stringify(res.data.group))
				}
			},
			//获取分组列表
			async getGroupList () {
				let params = {
					uid: localStorage.getItem('uid'),
				}
				if (this.type != 2) {
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
				this.choseItem = {};
				this.materialList = []
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
				} else {
					let msgModalBody = document.getElementsByClassName('msg-modal')[0].getElementsByClassName('ant-modal-body')[0]
					msgModalBody.onscroll = function () {
						return false
					}
				}
				if (this.chooseId != this.id) {
					this.id = this.chooseId
					this.selectedRowKeys = []
					this.selectedRowKeys.push(this.chooseId.toString())
				}


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

	};
</script>

<style lang='less' scoped>
	.content-hd {
		padding: 0;
		margin: 8px 0;
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
		width: 156.8px;
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
			width: 156.8px;
			height: 152px;
		}

		img {
			max-width: 100%;
			max-height: 100%;
		}
	}

	.imgSize:nth-child(5n+0) {
		margin-right: 0;
	}

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

	/deep/ .ant-card-meta-avatar {
		float: right;
		padding-right: 0;
	}

</style>