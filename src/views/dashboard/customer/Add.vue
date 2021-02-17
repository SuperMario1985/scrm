<template>
	<div class="list">
		<div id="components-layout-demo-basic" v-if="this.$store.state.wxArr.length !=0">
			<a-layout>
				<!-- 头部 -->
				<a-layout-header>
					新建客服消息
					<router-link to="/customer/list" style="font-size: 16px;float: right;margin-right: 15px;">
						<a-button type="primary" >返回列表</a-button>
					</router-link>
				</a-layout-header>
				<a-layout  class="fans-content">
					<!-- 左侧 -->
					<a-layout-sider>
						<div style="border:1px solid #E2D6D6;margin:auto;height:100%;width:100%;background:#FAFAFA;box-sizing: content-box;overflow-y: auto;">
							<img src="../../../assets/wxHeader.png" alt
							     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
							<!-- 图文素材 -->
							<div style="padding: 20px;" v-show="typeValue == 5 && is_use==0">
								<!-- 选择后显示的 -->
								<a-card hoverable v-show="closeShowModal2">
									<template v-for="(art, artIndex) in artList">
										<template v-if="artIndex == 0">
											<div
													style="height: 30px;line-height: 30px;background: #0F0F0F;opacity: 0.3;color: #FFF;padding: 0 10px;margin-top: -30px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
												{{art.title}}
											</div>
											<img alt="example" :src="commonUrl+art.local_path" slot="cover"
											     style="object-fit: cover;"/>
										</template>
										<template v-if="artIndex != 0">
											<a-card-meta :title="art.title" style="margin: 0;padding: 20px;">
												<a-avatar slot="avatar" shape="square" :size="64"
												          :src="commonUrl+art.local_path" style="object-fit: cover;"/>
											</a-card-meta>
										</template>
									</template>
								</a-card>
							</div>
							<!-- 自定义设置 -->
							<div style="padding: 20px;overflow: hidden;" v-show="typeValue == 5 && is_use == 1">
								<a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
								          :size="36"
								          style="margin-right: 10px;"/>
								<div class=""
								     style="width:calc(100% - 46px);height:100px;float: right;border-radius: 4px;background: #FFF;border: 1px solid #E9E9E9;">
									<div class="info"
									     style="width:50%;float:left;padding-left: 10px;padding-top: 10px;">
										<div class="title">{{title}}</div>
										<div class="name">{{digest}}</div>
									</div>
									<div v-show="closeShowModal3" class="img-wrap"
									     style="display:inline;float:right;padding-right:10px;padding-top:20px;">
										<img :src="commonUrl + cover_url" style="width:60px;height:60px;">
									</div>
								</div>
							</div>
							<!-- 图片素材 -->
							<div style="padding: 20px;" v-show="typeValue == 2">
								<!-- 选择前显示的 -->
								<div v-show="closeShowModal2==false">
									<a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									          :size="36"
									          style="margin-right: 10px;"/>
									<img src="../../../assets/img.png" alt
									     style="width: 150px;border-radius: 4px;"/>
								</div>
								<!-- 选择后显示的 -->
								<div v-show="closeShowModal2">
									<a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									          :size="36"
									          style="margin-right: 10px;"/>
									<img :src="local_path.img" alt style="width: 150px;border-radius: 4px;"/>
								</div>
							</div>
							<!-- 文本素材 -->
							<div style="padding: 20px;overflow: hidden;" v-show="typeValue == 1">
								<a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
								          :size="36"
								          style="margin-right: 10px;"/>
								<span v-html="textValue"
								      class="item-info msg_content_txt"></span>
							</div>
							<!-- 音频素材 -->
							<div style="padding: 20px;" v-show="typeValue == 3">
								<a-card hoverable style="height: 150px;">
									<!-- 选择前显示的 -->
									<div class="audio" v-show="closeShowModal2==false">
										<div class="box" v-show="isPlayMusic">
											<div class="wifi-symbol">
												<div class="wifi-circle first"></div>
												<div class="wifi-circle second"></div>
												<div class="wifi-circle third"></div>
											</div>
										</div>
									</div>
									<!-- 选择后显示的 -->
									<div class="audio" v-show="closeShowModal2">
										<div style="float: left;font-size: 16px;">{{file_name}}</div>
										<div class="box" v-show="isPlayMusic" @click="playMusic">
											<div class="wifi-symbol">
												<div class="wifi-circle first"></div>
												<div class="wifi-circle second"></div>
												<div class="wifi-circle third"></div>
											</div>
											<audio ref="audio" :src="local_path.audio"/>
										</div>
										<div class="box" v-show="isPlayMusic2">
											<div class="wifi-symbol">
												<div class="wifi-circle first"></div>
												<div class="wifi-circle second1"></div>
												<div class="wifi-circle third1"></div>
											</div>
										</div>
									</div>
								</a-card>
							</div>
							<!-- 视频素材 -->
							<div style="padding: 20px;" v-show="typeValue == 4">
								<!-- 选择前显示的 -->
								<a-card hoverable style="width: 100%" v-show="!closeShowModal2">
									<img alt="example" src="http://s.weituibao.com/static/1545276720179/video.png"
									     slot="cover"/>
									<a-card-meta style="height: 50px;"></a-card-meta>
								</a-card>
								<!-- 选择后显示的 -->
								<a-card hoverable style="width: 100%" v-show="closeShowModal2">
									<video-player class="video-player vjs-custom-skin" ref="videoPlayer"
									              :playsinline="true"
									              :options="playerOptions"></video-player>
									<a-card-meta :title="file_name"
									             style="height: 50px;line-height: 50px;text-align: center;">
									</a-card-meta>
								</a-card>
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
									<a-form-item label="选择公众号" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
										<div style="display: inline-block;cursor: pointer;" @click="add">
											<a-avatar shape="square" :size="40" :src="avatarImg"
											          style="margin: 0 15px;"/>
											<span>{{$store.state.wxNickName}}</span>
											<a-icon type="caret-down"
											        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"/>
										</div>
										<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
									</a-form-item>
								</a-form>
							</div>
							<div class="content-bd">
								<a-form>
									<!-- 消息名称 -->
									<a-form-item label="消息名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }"
									             style="padding-top: 15px;">
										<a-input v-model="msg_title"
										         style="width: calc(100% - 60px)"
										         placeholder="请填写消息名称（仅供备注，不会发送给粉丝），限20字符" :maxLength="20"/>
										<span style="display: inline-block; width: 50px; margin-left: 10px;color: #F56C6C">{{msg_title.length}} / 20</span>
									</a-form-item>
									<!-- 消息类型 -->
									<a-form-item label="消息类型" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
										<a-radio-group @change="changeType" v-model="typeValue">
											<a-radio :value="5">图文消息</a-radio>
											<a-radio :value="2">图片消息</a-radio>
											<a-radio :value="1">文字消息</a-radio>
											<a-radio :value="3">语音消息</a-radio>
											<a-radio :value="4">视频消息</a-radio>
										</a-radio-group>
									</a-form-item>
									<!-- 添加方式 -->
									<a-form-item label="添加方式" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }"
									             v-show="typeValue==5?true:false">
										<a-radio-group @change="changeUseType" v-model="is_use">
											<a-radio :value="0">从素材库导入</a-radio>
											<a-radio :value="1">自定义设置</a-radio>
										</a-radio-group>
									</a-form-item>
									<!-- 素材 -->
									<a-form-item :label="typeName" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }"
									             v-show="((typeValue == 5 && is_use == 1))?false:true">
										<div class="changeType">
											<div style="height: 110px;margin: auto;cursor: pointer;"
											     v-show="typeValue == 1?false:true"
											     @click="openShowModal2(0,material_id)">
												<!-- 选择前显示的 -->
												<div v-show="closeShowModal2==false"
												     style="line-height: 110px;height: 110px;text-align: center;">
													<a-icon type="plus" style="font-size: 26px;"/>
													<span v-if="typeValue == 5">选择图文消息</span>
													<span v-if="typeValue == 2">选择图片消息</span>
													<span v-if="typeValue == 3">选择语音消息</span>
													<span v-if="typeValue == 4">选择视频消息</span>
												</div>
												<!-- 选择后显示的 -->
												<div v-show="closeShowModal2" style="text-align: center;">
													<img src="../../../assets/circle.png" alt/>
													<i v-if="typeValue == 5">
														已选择1条图文消息
														<p class="editMessage">[修改]</p>
													</i>
													<i v-if="typeValue == 2">
														已选择1条图片消息
														<p class="editMessage">[修改]</p>
													</i>
													<i v-if="typeValue == 3">
														已选择1条语音消息
														<p class="editMessage">[修改]</p>
													</i>
													<i v-if="typeValue == 4">
														已选择1条视频消息
														<p class="editMessage">[修改]</p>
													</i>
												</div>
											</div>
											<div v-show="typeValue == 1">
												<medium-editor ref="medium_editor"
												               class="content-editable"
												               :text="textValue"
												               :options="options" @editorCreated="editorCreated"
												               @edit="changeContentInput" custom-tag="div"/>
											</div>
										</div>
										<div v-show="typeValue == 1">
											<div style="margin-right: 15px;float: right;">{{wordNum}}/{{wordLimit}}
											</div>
											<div style="padding: 0 15px;">
												点击插入：
												<a-button class="ant-tag ant-tag-orange" size="small"
												          @click="addTag">粉丝昵称
												</a-button>
												<a-popover trigger="click" :destroyTooltipOnHide="true"
												           v-model="emojiShow">
													<VEmojiPicker slot="content"
													              :showSearch="false"
													              @select="onSelectEmoji"/>
													<a-icon type="smile" class="icon-btn"
													        style="cursor: pointer;"/>
												</a-popover>
											</div>
											<div class="changeType-text">
												如何设置链接：输入文案后， 鼠标选中想要插入链接的关键词，点击出现的“设置链接”，即可填入链接。 提示：请尽量使用Chrome、360浏览器，其他浏览器可能出现无法正确插入粉丝昵称的情况
											</div>
										</div>
									</a-form-item>
									<!-- 自定义设置 -->
									<div v-show="typeValue == 5 && is_use == 1?true:false">
										<!-- 图片封面 -->
										<!-- 选中前 -->
										<a-form-item :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 15 }"
										             v-show="closeShowModal3==false">
											<template slot="label"><span style="color: red">*</span>图片封面
											</template>
											<div class="upload-wrap"
											     @click="openShowModal3(0,material_id)">
												<a-icon type="plus" class="upload-plus"/>
											</div>
										</a-form-item>
										<!-- 选中后 -->
										<a-form-item :label-col="{ span: 3 }"
										             :wrapper-col="{ span: 15 }"
										             v-show="closeShowModal3">
											<template slot="label"><span style="color: red">*</span>图片封面
											</template>
											<div class="upload-wrap"
											     @click="openShowModal3(0,material_id)">
												<img :src="commonUrl + cover_url" alt=""
												     class="upload-wrap-pic">
											</div>
											<span
													style="color: blue;position: absolute;bottom: 0;left: 110px;cursor: pointer;"
													@click="openShowModal3(0,material_id)">重新上传</span>
										</a-form-item>
										<!-- 填写标题 -->
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }"
										             style="padding-top: 15px;">
											<template slot="label"><span style="color: red">*</span>填写标题
											</template>
											<a-input v-model="title" placeholder="填写图文标题，限 32 字符"
											         :maxLength="32">
											<span slot="suffix">
                    <span>{{title.length}}</span>/32
                  </span>
											</a-input>
										</a-form-item>
										<!-- 添加描述 -->
										<a-form-item label="添加描述" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }"
										             style="padding-top: 15px;">
											<a-textarea
													style="height: 110px;border: 0;resize: none;border: 1px dashed #E2E2E2;"
													placeholder="填写图文描述" v-model="digest" :autosize="false"
													:maxLength="128"/>
											<div style="float:right;">
												<span>{{digest.length}}</span>/128
											</div>
										</a-form-item>
										<!-- 点击跳转 -->
										<a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }"
										             style="padding-top: 15px;">
											<template slot="label"><span style="color: red">*</span>点击跳转
											</template>
											<a-input v-model="content_url" placeholder="请输入跳转链接，且必须以http://或https://开头"
											         :maxLength="100"/>
										</a-form-item>
										<!-- 素材同步 -->
										<a-form-item label="素材同步" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }"
										             style="padding-top: 15px;">
											<a-radio-group @change="changeMaterialSync" v-model="materialSync">
												<a-radio :value="0">不同步</a-radio>
												<a-radio :value="1">同步至【内容引擎】
													<span v-show="materialSync == 1">
														选择分组：
													<a-tree-select
															style="width: 225px"
															:dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
															:treeData="groupList"
															placeholder='Please select'
															treeDefaultExpandAll
															v-model="selectGroupId"
													>
													</a-tree-select>
													</span>
												</a-radio>
											</a-radio-group>
										</a-form-item>
									</div>
									<!-- 群发粉丝 -->
									<a-form-item label="群发粉丝" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
										<a-radio-group @change="changeFans" v-model="fansValue">
											<a-radio :value="2">全部粉丝</a-radio>
											<a-radio :value="1">按条件筛选粉丝</a-radio>
										</a-radio-group>
										<span style="float: right;">
                      符合条件约
                      <span style="color:blue;">{{peopleNum}}</span>人
											<a-tooltip placement="bottom">
                    <template slot="title">
                      <span>仅在48小时内和公众号互动过的粉丝</span>
                    </template>
                    <a-icon type="question-circle" style="margin-left:5px;"/>
                  </a-tooltip>
                    </span>
										<div v-show="fansValue == 1" class="changeFans">
											<a-form>
												<a-form-item label="性别" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 20 }">
													<a-radio-group @change="changeSex" v-model="sexValue">
														<a-radio :value="0">全部性别</a-radio>
														<a-radio :value="1">仅男性粉丝</a-radio>
														<a-radio :value="2">仅女性粉丝</a-radio>
														<a-radio :value="3">未知性别</a-radio>
													</a-radio-group>
												</a-form-item>
												<a-form-item label="关注时间" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 20 }">
													<a-date-picker format="YYYY-MM-DD HH:mm:ss"
													               @change="startTime" v-model="startValue"
													               placeholder="开始日期"
													               @openChange="handleStartOpenChange"
													               :disabledDate="disabledStartDate2"
													               :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
													/>
													~
													<a-date-picker format="YYYY-MM-DD HH:mm:ss"
													               placeholder="结束日期" @change="endTime"
													               v-model="endValue" :open="endOpen"
													               @openChange="handleEndOpenChange"
													               :disabledDate="disabledEndDate2"
													               :show-time="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"/>
												</a-form-item>
												<a-form-item label="地域" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 20 }">
													<a-cascader :options="cityData" @change="changeCity"
													            v-model="province1"
													            style="width: 195px;text-align: left;"/>
												</a-form-item>
												<a-form-item label="标签" :label-col="{ span: 3 }"
												             :wrapper-col="{ span: 20 }">
													<template v-for="(item,index) in tagsList">
														<a-checkable-tag v-model="checked[index]"
														                 @change="changeTags(item.key)">{{item.name}}
														</a-checkable-tag>
													</template>
												</a-form-item>
												<span style="color: #F56C6C;margin-left: 12.5%;padding-left: 20px;">当粉丝同属于多个标签时，发送后只会接收到一条推送</span>
											</a-form>
										</div>
									</a-form-item>
									<!-- 群发时间 -->
									<a-form-item label="群发时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }"
									             style="padding-bottom: 15px;">
										<a-radio-group v-model="sendTime" @change="changeSendTime">
											<a-radio :value="1">立即发送</a-radio>
											<a-radio :value="2">指定时间发送</a-radio>
											<!--											<span style="color:#01b065;margin-left: 15px;">（实际发送时间因系统排队等原因，可能会与设定的时间发送有误差）</span>-->
										</a-radio-group>
										<div v-show="sendTime == 2">
											<a-date-picker @change="selectDate"
											               :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')"
											               :disabledDate="disabledStartDate" :allowClear="false"/>
											<a-time-picker :defaultValue="moment(getCurrentTime(), 'HH:mm')"
											               format="HH:mm"
											               style="width: 174px;margin-left: 15px;"
											               :disabledHours="disabledHours"
											               :disabledMinutes="disabledMinutes" @change="selectTime"
											               :allowClear="false"/>
										</div>
										<div class="content-msg">
											<p style="margin-bottom: 0px;line-height: 25px;font-size:12px;">
												实际发送时间因系统排队等原因，可能会与设定的时间发送有误差</p>
										</div>
										<div style="height: 20px;border-bottom: 1px solid #E0E0E0;"></div>
										<div style="margin-top: 15px;">
											<a-button type="primary" @click="createdMsg">确定并创建消息</a-button>
											<a-button style="margin-left: 15px;" @click="openPreview">发送预览</a-button>
										</div>
										<a-modal title="发送手机预览" v-model="visible">
											<template slot="footer">
												<a-button key="back" @click="handleCancel">取消</a-button>
												<a-button key="submit" type="primary" :loading="loading3"
												          @click="handleOk2">发送预览
												</a-button>
											</template>
											<p>1、发送 “客服消息预览” 消息给：</p>
											<a-input v-model="nick_name" readonly/>
											<p style="margin-top:20px;">2、输入该公众号回复的内容：</p>
											<a-input v-model="random"/>
											<div class="phoneView-txt">
												请用测试微信号给以上选中的公众号发送消息：“客服消息预览”，将公众号回复的内容输入到上方输入框内，测试ID有效时间为1小时。
											</div>
										</a-modal>
									</a-form-item>
								</a-form>
							</div>
						</div>
						<!-- 选择公众号弹窗 -->
						<wxModal :show="showModal5" :callback="modalVisibleChange5" hasName="customer-add"></wxModal>
						<!-- 选择消息弹窗 -->
						<chooseMsg :show="showModal2" :news_type="1" :type="typeValue2"
						           :callback="modalVisibleChange" :chooseId="chooseId"></chooseMsg>
						<!-- 选择消息弹窗 -->
						<chooseMsg :show="showModal3" :type="typeValue3" :callback="modalVisibleChange3"
						           :chooseId="chooseId"></chooseMsg>
					</a-layout-content>
				</a-layout>
			</a-layout>
		</div>
	</div>
</template>

<script>
	import {message} from "ant-design-vue";
	import chooseMsg from "@/components/ChooseMsg.vue";
	import cityData from "../../../common/js/citydata.js";
	import {videoPlayer} from "vue-video-player";
	import "video.js/dist/video-js.css";
	import moment from "moment";
	import "moment/locale/zh-cn";

	moment.locale("zh-cn");
	import wxModal from "@/components/WxModal.vue";
	import { VEmojiPicker } from "v-emoji-picker"
	import WEmoji from "@/common/js/wechatEmoji.js"
	import editor from 'vue2-medium-editor'

	export default {
		components: {
			chooseMsg, videoPlayer, wxModal, VEmojiPicker,
			'medium-editor': editor
		},
		data () {
			let thisGlobal = this.global
			let changeBackground =
				this.$store.state.wxNum.length > 0 ? this.$store.state.wxNum : "";
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
				isLoading       : false, //Loading 组件显示与隐藏
				wxInfo          : [], //微信公众号列表
				avatarImg       : "", //微信公众号头像
				showModal5      : false, //公众号组件弹窗显示与隐藏
				changeBackground: changeBackground, //选中背景色
				wxNum           : changeBackground, //修改后的微信id值
				typeValue       : 2, //消息类型,1文字 2图片 3语音 4视频 5图文
				typeName        : '图片', //消息类型,1文字 2图片 3语音 4视频 5图文
				is_use          : 0, //是否点击了图文下面的新建
				showModal2      : false, //选择消息对话框的显示与隐藏
				showModal3      : false, //选择消息对话框的显示与隐藏
				isPlayMusic     : true, //音频小喇叭的显示与隐藏
				isPlayMusic2    : false, //动态音频小喇叭的显示与隐藏
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
				fansValue       : 2, //群发粉丝
				sexValue        : 0, //群发粉丝性别
				textValue       : "", //文本内容
				closeShowModal2 : false, //是否选好素材
				closeShowModal3 : false, //是否选好图文消息的图片素材
				materialList    : [], //获取素材数组
				artList         : [], //手机上展示的图文素材
				local_path      : {
					img  : "",
					audio: ""
				}, //手机上展示的图片、音频、视频链接
				file_name       : "", //手机上展示的素材标题
				//分页
				page            : 1, //页数
				pageSize        : 15, //每页个数
				total           : 0, //总条数
				quickJumper     : false, // 是否显示快速跳转的控件
				//日期选择
				startValue      : null,
				endValue        : null,
				endOpen         : false,
				s_time          : "", //开始日期
				e_time          : "", //结束日期
				// 地域
				cityData,
				province        : "", //省份
				city            : "", //城市
				province1       : ["全部"],
				checked         : [],
				tagsList        : [], //标签列表
				tagCheckValue   : [], //选中的tag
				tag_arr         : [], //标签值数组
				tag_ids         : "", //标签值
				material_id     : "", //选中的素材id
				moment, //时间选择器
				dateValue       : parseInt(new Date().getTime() / 1000), //群发时间的日期
				timeValue       : parseInt(new Date().getTime() / 1000 + 600), //群发时间的时间
				peopleNum       : "", //符合条件的人数
				typeValue2      : 1, //传给子组件的type值，获取素材接口1为图文，所以要将传给子组件的type值改成1
				typeValue3      : 2, //图文消息中上传图片类型
				sendTime        : 1, //发送时间
				createdId       : 0, //群发id,添加为0，修改为1
				send_type       : 1, //群发时间，1立即发送，2指定时间
				msg_title       : "", //消息名称
				visible         : false, //发送预览弹窗
				loading3        : false, //手机预览确定按钮加载显示与隐藏
				username        : "", //发送预览的微信号
				date            : "00:00:00", //指定发送时间默认
				date2           : moment(), //指定发送日期默认
				commonUrl       : this.$store.state.commonUrl, //公共的链接
				title           : "",//图文消息的标题
				digest          : "",//图文消息的摘要
				cover_url       : "",//封面图片的URL
				content_url     : "",//正文的URL
				random          : "",//公众号回复的随机数
				nick_name       : "",//公众号昵称
				send_time       : '',//创建发送时间
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
				emojiShow       : false, // emoji 表情选择框是否显示
				chooseId        : 0,//跳入组件时，选择好的id
				wordNum         : 0,//编辑框的字数
				wordLimit       : 300, //  编辑框文字限制
				textContent     : '',//编辑框传给后台的内容
				materialSync    : 0,//素材是否同步，0不同步，1同步
				groupList       : [], // 小组列表
				selectGroupId   : '',// 上传选择的分组id
				keydownNode     : false,
				keydownNodeIndex: 0,
			};
		},

		methods: {
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
					this.textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
				}

				let event = {
					currentTarget: this.mediumEditor.origElements
				}
				this.mediumEditor.events.updateInput(event.currentTarget, event);

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
				var reg = /href="(?![a-zA-z]+:\/\/)[^"]*/g
				if (reg.test(operation.api.origElements.innerHTML)) {
					this.$message.error('请填写正确的链接')
					this.mediumEditor.execAction('unlink')
				}

				this.wordNum = self.lastNode.textContent.length
				if (this.wordNum <= this.wordLimit) {
					this.textValue = operation.api.origElements.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					this.textContent = operation.api.origElements.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')
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
					console.log(123);
				}
				if (event.keyCode == 13) {
					this.keydownNodeIndex = 0
					this.getParentP4Label(self.lastRange.startContainer)
				}
				this.keydownNode = event.keyCode == 13
			}
			,
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
				const customNode = this.$refs.medium_editor.$el
				const {startNode, startOffset, endNode, endOffset} = this.global.getRangeInfo(customNode, this.wordLimit);

				if (typeof startNode.nodeValue !== 'undefined') {
					let newRange = document.createRange()
					newRange.setStart(startNode, startOffset);
					newRange.setEnd(endNode, endOffset);
					// newSelection.removeAllRanges();
					// newSelection.addRange(newRange)
					newRange.deleteContents()

					this.textValue = self.lastNode.innerHTML.replace(/<pre([^>]*)>/g, '<p>').replace(/<\/pre>/g, '<\/p>').replace(/<font([^>]*)>/g, '<p>').replace(/<\/font>/g, '<\/p>').replace(/<div([^>]*)>/g, '<p>').replace(/<\/div>/g, '<\/p>')
					this.textContent = self.lastNode.innerHTML.replace(/(<p><span>)?<br([^>]*)>(<\/span>)?<\/p>/g, '</p>').replace(/<br([^>]*)>/g, '\n').replace(/(&nbsp;)?<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称<\/span>(&nbsp;)?/g, '{nickname}').replace(/([^<p>]+)<p([^>]*)>/g, "$1\n").replace(/<p([^>]*)>/g, '').replace(/<\/p>/g, '\n').replace(/<span([^>]*)>/g, '').replace(/<\/span>/g, '').replace(/&nbsp;/g, ' ').replace(/<div([^>]*)>/g, '\n').replace(/<\/div>/g, '').replace(/miniprogramappid/g, 'miniprogram-appid').replace(/miniprogrampath/g, 'miniprogram-path')

					this.wordNum = this.wordLimit

				}
				var divscll = document.getElementsByClassName('content-editable')[0];
				divscll.scrollTop = divscll.clientHeight

			},
			//点击插入粉丝昵称标签
			addTag: function () {
				var dom = this.mediumEditor.options.ownerDocument
				const html =
					'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">粉丝昵称</span>&nbsp;</span>'
				if (this.wordLimit - this.wordNum >= 6) {
					this.insertHTMLCommand(dom, html)
				}
			}
			,
			//更换公众号
			add () {
				this.showModal5 = true;
			}
			,

			modalVisibleChange5 (event, wxNum, wxNickName) {
				// console.log('event', event);
				if (event == "ok") {
					this.showModal5 = false;
					this.$store.dispatch("changeWxNum", wxNum);
					this.$store.commit("changeWxNickName", wxNickName);
					this.avatarImg = this.wxInfo[this.$store.state.wxNumIndex].head_img;
					this.nick_name = this.wxInfo[this.$store.state.wxNumIndex].nick_name;
					this.msg_title = ''
					this.typeValue = 2
					this.closeShowModal2 = false
					this.closeShowModal3 = false
					this.textValue = ''
					this.fansValue = 2
					this.startValue = null
					this.endValue = null
					this.province = "" //省份
					this.city = "" //城市
					this.province1 = ["全部"]
					this.checked = []
					this.date = "00:00:00"
					this.date2 = moment()
					this.sendTime = 1
					this.continue = 1//默认被转载
					this.material_id = ''
					this.tag_ids = ''
					this.tag_arr = []
					this.textContent = ''
					this.getFans()
				} else {
					this.showModal5 = false;
				}
			}
			,
			//选择类型
			changeType (e) {
				this.typeValue = e.target.value;
				this.is_use = 0;
				this.material_id = "";
				this.closeShowModal2 = false;
				this.title = ''
				this.digest = ''
				this.content_url = ''
				this.cover_url = ''
				if (this.typeValue == 5) {
					this.typeName = '图文';
				} else if (this.typeValue == 4) {
					this.typeName = '视频';
				} else if (this.typeValue == 3) {
					this.typeName = '语音';
				} else if (this.typeValue == 1) {
					this.typeName = '文本';
				} else {
					this.typeName = '图片';
				}
				this.textValue = ''
			}
			,
			//播放音频
			playMusic () {
				this.isPlayMusic = false;
				this.isPlayMusic2 = true;
				this.$nextTick(() => {
					// console.log(this.$refs.audio.play());
					this.$refs.audio.play();
					var t1 = setInterval(() => {
						// console.log(this.$refs.audio[index].paused);
						if (this.$refs.audio.paused) {
							clearInterval(t1);
							this.isPlayMusic = true;
							this.isPlayMusic2 = false;
						}
					}, 1000);
				});
			}
			,
			//素材同步
			changeMaterialSync (e) {
				if (this.materialSync == 1) {
					this.getGroupList()
				}
			},
			//获取分组列表
			async getGroupList () {
				const {data: res} = await this.axios.post("attachment/group", {
					uid       : localStorage.getItem('uid'),
					is_channel: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.groupList = res.data.group
					this.selectGroupId = this.groupList[0].key
				}
			},
			//群发粉丝
			changeFans (e) {
				// console.log(e.target.value)
				if (e.target.value == 1) {
					this.getTags();
				}
				this.startValue = null
				this.endValue = null
				this.province1 = ["全部"]
				this.checked = []
				this.tag_ids = "";
				this.tag_arr = [];
				this.sexValue = 0;
				this.province = "";
				this.city = "";
				this.s_time = "";
				this.e_time = "";
				this.getFans();
			}
			,
			//打开上传页面
			openShowModal2 (index, id) {
				if (typeof id == 'undefined') {
					this.chooseId = 0
				} else {
					this.chooseId = Number(id)
				}
				this.showModal2 = true;
				this.is_use = 0;
				//获取素材接口1为图文，所以要将传给子组件的type值改成1
				if (this.typeValue == 5) {
					this.typeValue2 = 1;
				} else {
					this.typeValue2 = this.typeValue;
				}
			}
			,
			modalVisibleChange (event, e, id) {
				// console.log('event', event);
				// console.log('callback', e);
				if (event == "ok") {
					if (isNaN(id) || id == '') {
						this.$message.error('请选择素材')
						this.showModal2 = false
					} else {
						this.closeShowModal2 = true;
						this.showModal2 = false;
						this.material_id = id;
						this.getOneMaterial();
					}
					// console.log(this.material_id);
				} else {
					this.showModal2 = false;
				}
			}
			,
			//选择图文类型
			changeUseType (e) {
				this.is_use = e.target.value;
				this.closeShowModal2 = false;
				this.material_id = "";
				this.closeShowModal3 = false;
				this.title = ''
				this.digest = ''
				this.content_url = ''
				this.cover_url = ''
				this.materialSync = 0
			},
			//打开上传页面
			openShowModal3 (index, id) {
				if (typeof id == 'undefined') {
					this.chooseId = 0
				} else {
					this.chooseId = Number(id)
				}
				// console.log(id, this.chooseId, 'chooseId')
				this.showModal3 = true;
			}
			,
			modalVisibleChange3 (event, e, id) {
				if (event == "ok") {
					if (isNaN(id) || id == '') {
						this.$message.error('请选择素材')
						this.showModal2 = false
					} else {
						this.closeShowModal3 = true;
						this.showModal3 = false;
						this.material_id = id;
						this.getOneMaterial();
					}
				} else {
					this.showModal3 = false;
				}
			},
			//根据组件返回的id获取单个素材信息
			async getOneMaterial () {
				const {data: res} = await this.axios.post("material/upload-media", {
					wx_id        : localStorage.getItem('wxNum'),
					attachment_id: this.material_id
				});
				// console.log(res)
				if (res.error == 0) {
					this.materialList = res.data[this.material_id];
					if (this.typeValue == 5) {
						if (this.is_use == 1) {
							this.cover_url = this.materialList.local_path;
						} else {
							this.artList = this.materialList.artList;
						}
					} else if (this.typeValue == 4) {
						this.file_name = this.materialList.file_name;
						var sourceData = [
							{
								src : this.commonUrl + this.materialList.local_path, // 路径
								type: "video/mp4" // 类型
							}
						];
						this.$set(this.playerOptions, "sources", sourceData);
					} else if (this.typeValue == 3) {
						this.local_path.audio = this.commonUrl + this.materialList.local_path;
						this.file_name = this.materialList.file_name;
					} else {
						this.local_path.img = this.commonUrl + this.materialList.local_path;
						this.file_name = this.materialList.file_name;
					}
				} else {
					this.$message.error(res.error_msg);
				}
				// console.log(this.materialList)
			},
			//修改性别
			changeSex (e) {
				// console.log(e.target.value)
				this.sexValue = e.target.value;
				this.getFans();
			}
			,
			//关注时间
			handleStartOpenChange (open) {
				if (!open) {
					this.endOpen = true;
				}
			}
			,
			handleEndOpenChange (open) {
				this.endOpen = open;
			}
			,
			startTime (startValue) {
				if (startValue == null) {
					this.s_time = ''
				} else {
					this.s_time = startValue.format("X");
				}
				// console.log(this.s_time)
				this.getFans();
			}
			,
			endTime (endValue) {
				if (endValue == null) {
					this.e_time = ''
				} else {
					this.e_time = endValue.format("X");
				}
				// console.log(this.e_time)
				this.getFans();
			}
			,
			disabledStartDate2 (startValue) {
				const endValue = this.endValue;
				if (!startValue || !endValue) {
					return false;
				}
				return startValue.valueOf() > endValue.valueOf();
			}
			,
			disabledEndDate2 (endValue) {
				const startValue = this.startValue;
				if (!endValue || !startValue) {
					return false;
				}
				return startValue.valueOf() >= endValue.valueOf();
			}
			,
			// 地域
			changeCity (value) {
				// console.log(value)
				if (value[0] != "全部") {
					this.province = value[0];
				} else {
					this.province = "";
				}
				if (value[1] != "全部") {
					this.city = value[1];
				} else {
					this.city = "";
				}
				this.getFans();
			}
			,
			//获取标签
			async getTags () {
				const {data: res} = await this.axios.post("tags/tags-get-all", {
					wx_id:localStorage.getItem('wxNum'),
					type: 1
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.tagsList = res.data.info;
					for (var i = 0; i < this.tagsList.length; i++) {
						var checked = false;
						this.checked.push(checked);
					}
				}
			}
			,
			//标签
			changeTags (key) {
				Array.prototype.indexOf = function (val) {
					for (var i = 0; i < this.length; i++) {
						if (this[i] == val) return i;
					}
					return -1;
				};
				Array.prototype.remove = function (val) {
					var index = this.indexOf(val);
					if (index > -1) {
						this.splice(index, 1);
					}
				};
				// console.log(this.tag_arr,'tag_arr')
				if (this.tag_arr.includes(key)) {
					this.tag_arr.remove(key);
				} else {
					this.tag_arr.push(key);
				}
				this.tag_ids = this.tag_arr.join();
				// console.log(this.tag_ids,'tag_ids')
				this.getFans();
			}
			,
			//群发时间
			selectDate (value) {
				// console.log(value.format("X"))
				this.dateValue = new Date(value.format("YYYY-MM-DD")).getTime() / 1000;
			}
			,
			disabledStartDate (date2) {
				//打开开始时间面板调用的函数
				return date2.valueOf() < new Date().getTime() - 86400000; //大于今天的日期一律返回true，禁止选择
			}
			,
			getCurrentData () {
				this.date2 = moment.unix(this.dateValue).format("YYYY-MM-DD");
				return this.date2;
			}
			,
			selectTime (time, timeString) {
				this.timeValue = parseInt(new Date(time).getTime() / 1000);
			}
			,
			disabledHours () {
				let year = new Date().getFullYear()
				let month = new Date().getMonth() + 1
				let day = new Date().getDate()
				let dateStr = moment.unix(this.dateValue).format("YYYY-MM-DD")
				if (new Date(dateStr).getTime() / 1000 - 28800 <= new Date(year + '/' + month + '/' + day).getTime() / 1000) {
					const dateString = new Date().getTime() + 600000;
					var a = moment(dateString).format("HH:mm");
					let hours = [];
					let timeArr = a.split(":");
					for (var i = 0; i < parseInt(timeArr[0]); i++) {
						hours.push(i);
					}
					return hours;
				}
			}
			,
			disabledMinutes (selectedHour) {
				let year = new Date().getFullYear()
				let month = new Date().getMonth() + 1
				let day = new Date().getDate()
				let dateStr = moment.unix(this.dateValue).format("YYYY-MM-DD")
				if (new Date(dateStr).getTime() / 1000 - 28800 <= new Date(year + '/' + month + '/' + day).getTime() / 1000) {
					const dateString = new Date().getTime() + 600000;
					var a = moment(dateString).format("HH:mm");
					let minutes = [];
					let timeArr = a.split(":");
					if (selectedHour == parseInt(timeArr[0])) {
						for (var i = 0; i < parseInt(timeArr[1]); i++) {
							minutes.push(i);
						}
					}
					return minutes;
				}
			}
			,
			getCurrentTime () {
				this.date = moment.unix(this.timeValue).format("HH:mm");
				// console.log(this.date,'time1')
				return this.date;
			}
			,
			//群发时间类型
			changeSendTime (e) {
				this.send_type = e.target.value;
			}
			,
			//确定并创建消息
			async createdMsg () {
				// console.log(this.textValue)
				// console.log(this.textContent,'999')

				//发送时间
				let a = moment.unix(this.dateValue).format("YYYY-MM-DD") + 'T' + moment.unix(this.timeValue).format("HH:mm")
				// console.log(a,new Date(a).getTime())
				this.send_time = new Date(a).getTime() / 1000

				if (!this.checkData()) {
					return false;
				}

				if (this.fansValue == 3) {
					if (this.openids == '') {
						this.$message.error("粉丝openid不能为空");
					} else if (this.openids.split(";").length > 8) {
						this.$message.warning("最多单次一次性指定8个粉丝");
						return false;
					} else if (this.openids.split(";").length < 2) {
						this.$message.warning("单次最少指定2个粉丝");
						return false;
					}
				} else {
					if (this.peopleNum == 0) {
						this.$message.error("没有符合条件的粉丝");
						return false
					}
				}

				if (this.textContent == '\n') {
					this.textContent == ''
				}
				const {data: res} = await this.axios.post("kf-push-msg/add", {
					wx_id:localStorage.getItem('wxNum'),
					id         : this.createdId,
					msg_title  : this.msg_title,
					msg_type   : this.typeValue,
					material_id: this.material_id,
					content    : this.textContent,
					push_type  : this.fansValue,
					sex        : this.sexValue,
					s_time     : this.s_time,
					e_time     : this.e_time,
					province   : this.province,
					city       : this.city,
					tag_ids    : this.tag_ids,
					target_num : this.peopleNum,
					send_type  : this.send_type,
					send_time  : this.send_time,
					continue   : this.continue,
					is_use     : this.is_use,
					title      : this.title,
					digest     : this.digest,
					cover_url  : this.cover_url,
					content_url: this.content_url,
					is_sync    : this.materialSync,
					group_id   : this.selectGroupId
				});
				// console.log(res, 96369);
				if (res.error == 0) {
					this.$message.success('创建成功');
					this.$router.push("/customer/list?isRefresh=1")
				} else {
					this.$message.error(res.error_msg);
				}
			}
			,
			//获取符合条件的粉丝人数
			async getFans () {
				var sexVal = "";
				if (this.sexValue == "0") {
					sexVal = "";
				} else {
					sexVal = this.sexValue;
				}
				const {data: res} = await this.axios.post("fans/get-user-list", {
					wx_id: this.$store.state.wxNum,
					tag_ids     : this.tag_ids,
					sex         : sexVal,
					province    : this.province,
					city        : this.city,
					s_time      : this.s_time,
					e_time      : this.e_time,
					is_kf       : 1,//从客服消息请求粉丝
					is_condition: 1
				});
				// console.log(res)
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.peopleNum = res.data.count;
				}
			}
			,
			//检查数据
			checkData () {
				if (this.msg_title == '') {
					this.$message.error('请填写消息名称！');
					return false;
				}
				if (this.typeValue == 1) {
					if (this.textValue == '') {
						this.$message.error('请填写文字消息！');
						return false;
					}
				} else {
					if (this.is_use == 1) {
						if (this.title == '') {
							this.$message.error('请填写标题！');
							return false;
						}
						if (this.cover_url == '') {
							this.$message.error('请上传封面！');
							return false;
						}
						var reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
						if (this.content_url == '') {
							this.$message.error('请填写正确的链接地址！');
							return false;
						} else if (!reg.test(this.content_url)) {
							this.$message.error('请填写正确的链接地址！');
							return false;
						}
					} else if (this.material_id == 0) {
						this.$message.error('请选择素材！');
						return false;
					}
				}
				return true;
			}
			,
			//发送预览
			openPreview () {
				if (!this.checkData()) {
					return false;
				}
				this.visible = true;
			}
			,
			handleCancel (e) {
				this.visible = false;
			}
			,
			handleOk2 (e) {
				// this.loading3 = true;
				this.createdPreview();
			}
			,
			async createdPreview () {
				const {data: res} = await this.axios.post(
					"kf-push-msg/preview",
					{
						wx_id:localStorage.getItem('wxNum'),
						username   : this.username,
						material_id: this.material_id,
						content    : this.textContent,
						random     : this.random,
						msg_type   : this.typeValue,
						is_use     : this.is_use,
						title      : this.title,
						digest     : this.digest,
						cover_url  : this.cover_url,
						content_url: this.content_url,
					}
				);
				// console.log(res);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					// this.random = ''
				} else {
					this.$message.success("发送成功");
					this.visible = false;
					this.random = ''
				}
			}
		}
		,

		beforeCreate () {
			if (!this.$store.state.wxNum) {
				this.$router.back();
			}
		},
		created () {
			this.getFans();
			const _this = this;
			this.$store.dispatch("getWx", info => {
				_this.wxInfo = info;

				if (!_this.avatarImg) {
					_this.avatarImg = _this.wxInfo[_this.$store.state.wxNumIndex].head_img;
				}
				if (!_this.nick_name) {
					_this.nick_name = _this.wxInfo[_this.$store.state.wxNumIndex].nick_name;
				}
			});
			document.addEventListener("selectionchange", function () {
				_this.getCursor(self)
			})
		}
	}
	;
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	@import "../../../style/default.css";
	@import "../../../style/medium-editor-toolbar.css";

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

	/deep/ .ant-col-20 {
		margin-left: 15px;
	}

	#components-layout-demo-basic {
		.ant-layout-sider {
			background: #FFF;
			flex: 0 0 380px !important;
			max-width: 380px !important;
			min-width: 380px !important;
			width: 380px !important;
			border-right: 1px solid #E2E2E2;
			padding: 20px 0;
		}
	}

	#components-layout-demo-basic .ant-layout-content {
		min-width: 885px;
		width: 100%;
		position: relative;
	}

	.content {
		border: 1px solid #E2E2E2;
		min-width: 885px;
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

	.changeType {
		border: 1px dashed #E2E2E2;
		background: #FFF;
		margin: 15px 0;
		line-height: 110px;

		span {
			vertical-align: super;
			margin-left: 10px;
		}
	}

	.editMessage {
		display: inline-block;
		margin-left: 10px;
		color: blue;
	}

	.changeType3 {
		border: 1px dashed #E2E2E2;
		background: #FFF;
		margin: 15px 0;
		line-height: 110px;
		width: 120px;

		span {
			position: absolute;
			top: 38px;
			margin-left: 15px;
		}

		p {
			display: inline-block;
			margin-left: 10px;
			color: blue;
		}
	}

	.content-bd {
		background: #FAFAFA;
	}

	.msg_content_txt {
		width: calc(100% - 46px);
		border: 1px solid #E9E9E9;
		padding: 10px 16px;
		border-radius: 4px;
		font-size: 14px;
		color: #1A1A1A;
		background: #FFF;
		float: right;
		resize: none;
		word-wrap: break-word;
	}

	.audio {
		width: 100%;
		height: 50px;
		padding: 50px 20px;
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

	.changeType-text {
		background: #FFF2DB;
		border: 1px solid #FFDDA6;
		border-radius: 2px;
		padding: 7px 27px 6px 10px;
		font-size: 12px;
		width: 100%;
		margin: 8px 0 4px;
		max-width: 673px;
		line-height: 20px;
	}

	.changeFans {
		background: #FFFFFF;
		border: 1px solid #D8D8D8;
		padding: 12px 16px;
	}

	/deep/ .ant-tag-checkable {
		background-color: #FAFAFA;
		border-color: #D9D9D9;
		margin: 5px;
	}

	/deep/ .ant-tag-checkable-checked {
		background-color: #01b065;
	}

	i {
		font-style: normal;
	}

	.phoneView-txt {
		width: 100%;
		background: #FFF2DB;
		border: 1px solid #FFDDA6;
		margin-top: 20px;
		padding: 6px 10px;
		font-size: 12px;
	}

	/deep/ .emoji {
		font-size: 20px;
		height: 40px !important;
		width: 40px !important;
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
		height: 110px;
		overflow: auto;

		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
	}

	/deep/ .ant-tag {
		height: 26px;
		line-height: 25px;
	}

	.content-msg {
		width: 100%;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 5px 10px;
		margin-top: 12px;
		text-align: left;
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

	.upload-wrap {
		width: 96px;
		height: 96px;
		text-align: center;
		border: 1px dashed #D8D8D8;
		background: #FFF;
		cursor: pointer;
		position: relative;
	}

	.upload-wrap-pic {
		max-width: 80px;
		max-height: 80px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
	}

	/deep/ .ant-form-item-children {
		display: block;
	}

	.upload-plus {
		font-size: 32px;
		line-height: 96px;
		font-weight: 300;
		color: #686868;
	}

	.title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.name {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		float: left;
		word-wrap: break-word;
		width: 100%;
	}
</style>