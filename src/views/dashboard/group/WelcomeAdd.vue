<template>
	<div class="list">
		<div id="components-layout-demo-basic">
			<a-spin tip="Loading..." size="large" :spinning="isLoading">
				<a-layout>
					<!-- 头部 -->
					<a-layout-header>
						<template v-if="typeof urlId == 'undefined'">新建</template>
						<template v-if="typeof urlId != 'undefined'">修改</template>
						群欢迎语
						<router-link to="/group/welcome?isRefresh=1" style="font-size: 16px;float: right;margin-right: 15px;">
							<a-button type="primary" icon="rollback">返回列表</a-button>
						</router-link>
					</a-layout-header>
					<a-layout class="fans-content">
						<!-- 左侧 -->
						<a-layout-sider>
							<div class="wrap">
								<img src="../../../assets/wxHeader.png" alt
								     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
								<div class="msg_content_body">
									<!--文本-->
									<div v-if="textAreaValueHeader" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<span v-html="textAreaValueHeader" class="item-info msg_content_txt" style="display:block;white-space: pre-wrap;word-wrap: break-word;"></span>
									</div>
									<!--图片-->
									<div v-if="img" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;object-fit: cover;"/>
										<img :src="commonUrl+img" alt
										     style="width: 150px;border-radius: 4px;"/>
									</div>
									<!--网址-->
									<div v-if="modalUrlOk" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="margin-right: 10px;float: left;"/>
										<div class="item-info msg_content_txt">
											<p class="url-title">{{inputTitle}}</p>
											<div style="overflow: hidden;">
												<div class="url-text">{{digest}}</div>
												<img :src="commonUrl+msgUrl" alt="" style="object-fit: cover;" class="url-img">
											</div>
										</div>
									</div>
									<!--小程序-->
									<div v-if="modalAppletOk" class="mt">
										<a-avatar
												src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
												:size="36" style="object-fit: cover;margin-right: 10px;float: left;"/>
										<div class="item-info msg_content_txt">
											<!--											<p class="url-title" style="color: #A3A3A3;">{{appletInputTitle}}</p>-->
											<p class="applet-title">{{appletInputTitle}}</p>
											<img :src="commonUrl+appletUrl" alt="" style="width: 100%;">
										</div>
									</div>
								</div>
							</div>
						</a-layout-sider>
						<!-- 内容 -->
						<a-layout-content>
							<div class="content">
								<!-- <a-spin tip="Loading..." size="large" :spinning="isLoading"></a-spin> -->
								<!-- 选择企业微信 -->
								<div class="content-hd" v-if="$store.state.corpArr.length > 1">
									<a-form>
										<a-form-item label="选择企业微信" :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 21 }">
											<template>
												<div style="display: inline-block;cursor: pointer;" @click="changeCorp">
													<img src="../../../assets/WeChatLogo.png"
													     style="width: 24px;margin: -3px 6px 0 0;"/>
													<span>{{corpName}}</span>
													<a-icon type="caret-down"
													        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
													        v-if="typeof urlId=='undefined'"/>
												</div>
												<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
											</template>
										</a-form-item>
									</a-form>
								</div>
								<div class="content-bd" style="padding-top: 20px;">
									<a-form>
										<!-- 内容 -->
										<a-form-item label="群欢迎语内容" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
											<div class="pull-right fl">
												<editor v-if="editorFlag" :text="textContent"
												        :textValue="textAreaValueHeader"
												        :isEmoji="false"
												        @changeText="changeText">
												</editor>
												<div v-if="!img && !modalUrlOk && !modalAppletOk"
												     style="margin: 10px 0;cursor: pointer;" :key='popoverKey'>
													<a-popover trigger="click" v-model="popVisible" @visibleChange="visibleChange">
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
										<a-form-item>
											<div style="margin-top: 2px;margin-left: 12.5%;">
												<a-button type="primary" @click="createWelcome"
												          :disabled="createDisabled">
													<template v-if="typeof urlId == 'undefined'">创建</template>
													<template v-if="typeof urlId != 'undefined'">修改</template>
													群欢迎语
												</a-button>
											</div>
										</a-form-item>
									</a-form>
								</div>
							</div>
						</a-layout-content>
					</a-layout>
				</a-layout>
			</a-spin>
			<!-- 企业微信选择弹窗 -->
			<WeChatModal :show="showModal2" :callback="modalVisibleChange" hasName="welcome-add"></WeChatModal>
			<!-- 选择素材弹窗 -->
			<chooseMsg :show="showModal3" :type="typeValue2" :comefrom="comefrom" :news_type="news_type"
			           :callback="modalVisibleChange2" :sketchType="'1'" :chooseId="chooseId"></chooseMsg>
			<chooseMinipro :show="showModalMinipro" :type="typeValue2"
			               :callback="modalVisibleChange2" :chooseId="chooseId"></chooseMinipro>
			<!-- 网址 -->
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
											:treeData="groupList"
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
					<div class="content-msg">
						<p style="margin-bottom: 2px;line-height: 20px;">
							在企业微信里发送小程序（必须在微信公众平台通过审核和发布的），请先将其关联到企业微信（
							<a target="_blank" href="https://support.qq.com/products/104790/faqs/61672">
								如何关联</a>
							），再到本系统添加该小程序，否则发送失败，客户接收不到。
						</p>
						<p style="margin-bottom: 2px;line-height: 20px;">
							如果没有微信小程序，请前往微信小程序进行注册。
							<a target="_blank" href="https://mp.weixin.qq.com/cgi-bin/wx">
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
											:treeData="groupList"
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
	</div>
</template>

<script>
	import WeChatModal from "@/components/WeChatModal.vue"
	import chooseMsg from "@/components/ChooseMsg"
	import MyIcon from "@/components/MyIcon.vue"
	import chooseMinipro from '@/components/FilingCabinet/Miniprogram.vue'
	import cropperModal from '../../../components/picCropper/CropperModal'
	import editor from '../../../components/editor/index'

	export default {
		components: {
			WeChatModal, chooseMsg, MyIcon, chooseMinipro, cropperModal,editor
		},
		data () {
			return {
				editorFlag         : false,
				textAreaValueHeader: '',
				textContent        : '',
				popoverKey         : 0, // 强刷图片/图文/小程序选择 popover组件
				//左侧
				text               : '',//文本
				material_id        : '',//选中的图片素材id
				img                : '',//选中的图片素材url
				fileName           : '',//选中的图片素材的名字
				commonUrl          : this.$store.state.commonUrl, //公共的链接
				isLoading          : false, //Loading 组件显示与隐藏
				urlId              : '',//编辑时，地址栏的id
				corpInfo           : [], //企业列表
				suite_id           : 1,//应用ID
				corpId             : '',//企业微信选中的id
				corpName           : '',//企业微信选中的名字
				showModal2         : false, //公众号组件弹窗显示与隐藏
				createDisabled     : false,//控制创建欢迎语按钮的禁用
				showModal3         : false,//选择图片弹窗的显示与隐藏
				typeValue2         : 2,  // 1.图文 2.图片
				material_id1       : '',
				news_type          : 1,
				chooseId           : 0,//选择的图片id
				showModalUrl       : false,//网址弹窗
				sketchAddType      : 1, // 新建或导入
				sketchAddType1     : 1,
				url                : '',//网址弹窗输入的网址
				closeShowModal3    : false,//网址弹窗封面选没选好
				msgUrl             : '',//网址弹窗封面选好的url
				inputTitle         : '',//网址弹窗输入标题
				digest             : '',//网址弹窗输入描述
				confirmLoading     : false,//网址弹窗确认按钮的Loading
				popVisible         : false,//控制选择图片、网址、小程序的popover的显示与隐藏
				groupId            : [],//分组id
				index              : 0,//判断是图片打开素材弹窗还是链接打开，1是图片，2是链接，3是小程序
				modalUrlOk         : false,//判断网址弹窗关闭时是否成功选择
				showModalApplet    : false,//小程序弹窗的显示与隐藏
				miniproAddType     : 1, // 新建或导入
				miniproAddType1    : 1,
				material_id3       : '',
				showModalMinipro   : false, // 导入框
				appletUrl          : '',//小程序的封面链接
				appletInputTitle   : '',//小程序的标题
				appid              : '',//小程序的appid
				pageUrl            : '',//小程序page路径
				closeModalApplet   : false,//小程序弹窗封面选没选好
				modalAppletOk      : false,//判断小程序弹窗关闭时是否成功选择
				corpArr            : [],//企业微信数组
				groupList          : [],
				selectGroupId      : '',
				disabledSync       : 0,
				materialSync       : 0,
				// 弹窗数据，避免影响页面数据
				materialSync1      : 0,
				disabledSync1      : 0,

				material_id0       : '',

				msgUrl1            : '',
				inputTitle1        : '',
				digest1            : '',
				url1               : '',
				material_id11      : '',
				selectGroupId1      : '',

				appletUrl1         :  '',
				appletInputTitle1: '',
				appid1: '',
				pageUrl1: '',
				material_id31      : '',
				comefrom : ''
			}
		},
		methods   : {
			//素材同步
			changeMaterialSync () {
				if (this.materialSync1 == 1) {
					this.getGroupList()
				}

			},
			//获取分组列表
			async getGroupList (key) {
				const {data: res} = await this.axios.post("attachment/group", {
					uid: localStorage.getItem('uid'),
					is_channel : 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					this.selectGroupId1 = key || this.groupList[0].key
				}
			},
			changeCorp () {
				if (this.$route.query.id) {
					return
				}
				this.showModal2 = true
			},
			visibleChange() {
				this.popoverKey++
			},
			//选择图片、选择网址封面
			choosePic (index) {
				if(index == 3) {
					this.comefrom = '3'
				} else {
					this.comefrom = '1'
				}
				if(index == 1) {
					this.chooseId = Number(this.material_id || 0)
				} else {
					this.chooseId = Number(this.material_id0 || 0)
				}
				this.typeValue2 = 2
				this.showModal3 = true
				this.popVisible = false
				this.showModalUrl = false
				this.showModalApplet = false
				this.index = index
			},
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
				if(this.sketchAddType1 == 1 && this.msgUrl) {
					this.closeShowModal3 = true
				}
				this.msgUrl1 = this.msgUrl
				this.inputTitle1 = this.inputTitle
				this.digest1 = this.digest
				this.url1 = this.url
				this.material_id11 = this.material_id1
				this.material_id0 = this.material_id
				this.sketchAddType = this.sketchAddType1
				this.selectGroupId1 = this.selectGroupId
				this.materialSync1 = this.materialSync
				this.disabledSync1 = this.disabledSync
				this.index = index
			},
			openShowModal () {
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
						if(!this.img) {
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
			cancleAppletPic() {
				this.showModalApplet = true
			},
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
				if(this.miniproAddType1 == 1 && this.appletUrl) {
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
			checkout(title) {
				if(title.length < 4) {
					this.$message.warning('小程序标题长度需在4-12个字符')
				}
			},
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
			//创建、修改欢迎语
			async createWelcome () {
				const {data: res} = await this.axios.post("work-chat/chat-welcome-add", {
					corp_id           : this.corpId,
					id                : this.urlId,
					add_type          : this.index,
					text_content      : this.textContent,
					media_id          : this.material_id,
					link_title        : this.inputTitle,
					link_attachment_id: this.material_id,
					link_desc         : this.digest,
					link_url          : this.url,
					mini_title        : this.appletInputTitle,
					mini_pic_media_id : this.material_id,
					mini_appid        : this.appid,
					mini_page         : this.pageUrl,
					attachment_id     : this.material_id3 || this.material_id1,
					materialSync      : this.materialSync,
					groupId           : this.selectGroupId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					if(typeof this.urlId == "undefined") {
						this.$router.push("group/welcome")
					} else {
						this.$router.push("/group/welcome?isRefresh=1")
					}
				}
			},
			//编辑时进入获取欢迎语内容
			async getDetail () {
				const {data: res} = await this.axios.post("work-chat/chat-welcome-detail", {
					uid: localStorage.getItem("uid"),
					id : this.urlId
				});
				if (res.error != 0) {
					this.isLoading = false;
					this.$message.error(res.error_msg);
				} else {
					this.corpId = res.data.corp_id
					this.corpName = res.data.corp_name
					this.textContent = res.data.text_content
					this.textAreaValueHeader = res.data.text_content.replace(/{nickname}/g,
						'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>'
					).replace(/\n/g, '<br>')
					this
					this.index = res.data.add_type
					if (res.data.add_type == 1) {
						this.img = res.data.image_url
						this.fileName = res.data.file_name
						this.material_id = res.data.image_attachment_id
					} else if (res.data.add_type == 2) {
						if (res.data.attachment_id != 0) {
							this.material_id1 = res.data.attachment_id
							this.closeShowModal3 = true
							this.sketchAddType1 = 0
						} else {
							this.disabledSync = res.data.material_sync
							this.materialSync = res.data.material_sync
							this.closeShowModal3 = true
							this.getGroupList(res.data.groupId.toString())
							this.selectGroupId = res.data.groupId.toString()
						}
						this.modalUrlOk = true
						this.msgUrl = res.data.link_pic_url
						this.inputTitle = res.data.link_title
						this.digest = res.data.link_desc
						this.material_id = res.data.link_attachment_id
						this.url = res.data.link_url
					} else if (res.data.add_type == 3) {
						if (res.data.attachment_id != 0) {
							this.material_id3 = res.data.attachment_id
							this.miniproAddType1 = 0
						} else {
							this.disabledSync = res.data.material_sync
							this.materialSync = res.data.material_sync
							this.getGroupList(res.data.groupId.toString())
							this.selectGroupId = res.data.groupId.toString()
							this.closeModalApplet = true
						}
						this.disabledSync = res.data.material_sync
						this.modalAppletOk = true
						this.appletInputTitle = res.data.mini_title
						this.appletUrl = res.data.mini_pic_url
						this.material_id = res.data.mini_attachment_id
						this.appid = res.data.mini_appid
						this.pageUrl = res.data.mini_page
					}
					this.editorFlag = true
					this.isLoading = false
				}
			},
			modalVisibleChange (type, corpId, corpName) {
				if (type == 'ok') {
					if (this.corpId != corpId) {
						this.corpId = corpId
						this.corpName = corpName
					}
				}
				this.showModal2 = false
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
			changeText (text, textVale) {
				this.textContent = text
				this.textAreaValueHeader = textVale
			}
		},

		beforeCreate () {
			if (!this.$store.state.corpId) {
				this.$router.back()
			}
		},
		created () {
			this.urlId = this.$route.query.id
			if (typeof this.urlId != "undefined") {
				this.isLoading = true;
				this.getDetail()
			} else {
				this.editorFlag = true
			}
			this.corpId = localStorage.getItem('corpId')
			this.corpName = localStorage.getItem('corpName')
			this.corpArr = this.$store.state.corpArr
		},
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/default.css";
	@import "../../../style/medium-editor-toolbar.css";
	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin: 0px 0px 15px 10px;
		text-align: left;
	}
	.content-msg a:link {
		color: #01b065;
		text-decoration: none;
	}

	//未访问：蓝色、无下划线
	.content-msg a:visited {
		color: #01b065;
		text-decoration: none;
	}
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

	.type {
		display: inline-block;
		width: 65px;
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
		height: 320px;
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

	.box {
		float: right;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		box-sizing: border-box;
		position: relative;
		border: 2px solid #01b065;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
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

	.wrap {
		border: 1px solid #E2D6D6;
		margin: auto;
		height: 100%;
		width: 100%;
		background: #F5F5F5;
		overflow-y: auto;
		box-sizing: content-box;
	}

	/deep/ .ant-spin-nested-loading, /deep/ .ant-spin-container, /deep/ .ant-layout {
		height: 100%;
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

	.material {
		max-width: 80px;
		max-height: 80px;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.material-div {
		display: inline-block;
		position: relative;
		width: 100px;
		height: 100px;
		border: 1px dashed #D8D8D8;
	}

	.clear-current-list {
		display: inline-block;
		cursor: pointer;
		margin-left: 10px;
		color: #01b065;
	}

	/deep/ .ant-form-item-control {
		margin-left: 15px;
		margin-bottom: 10px;
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

	.url-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 18px;
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

	.url-img {
		float: right;
		width: 64px;
		height: 64px;
	}

	.applet-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 10px;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 52px;
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
</style>