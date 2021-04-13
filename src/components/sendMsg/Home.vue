<template>
  <div v-if="msgObj && msgObj.typeValue">
    <a-form-item label="消息类型" :label-col="{ span: 3 }"
                 :wrapper-col="{ span: 21 }">
      <a-radio-group name="radioGroup" key="tabs"
                     v-model="msgObj.typeValue"
                     @change="changeTypeValue()">
				<a-radio v-if="msgObj.typeName[1]" :value="1">文本</a-radio>
        <a-radio v-if="msgObj.typeName[5]" :value="5">
          图文
        </a-radio>
				<a-radio v-if="msgObj.typeName[7]" :value="7">文件</a-radio>
        <a-radio v-if="msgObj.typeName[2]" :value="2">图片</a-radio>
       
        <a-radio v-if="msgObj.typeName[3]" :value="3">音频</a-radio>
        <a-radio v-if="msgObj.typeName[4]" :value="4">视频</a-radio>
        <a-radio v-if="msgObj.typeName[6]" :value="6">小程序</a-radio>
      </a-radio-group>
    </a-form-item>
    <template v-if="msgObj.typeValue && msgObj.typeValue == 5"
              v-for="(sketch,sketchIndex) in msgObj.sketchList">
      <!-- 添加方式 -->
			<a-form-item v-if="typeof msgObj.isSketchAdd == 'undefined' || msgObj.isSketchAdd" label="添加方式" :label-col="{ span: 3 }"
                   :wrapper-col="{ span: 21 }">
        <a-radio-group name="radioGroup"
                       key="sketch"
                       v-model="sketch.addType"
                       @change="changeAddType(sketchIndex)">
          <a-radio :value="1">新建</a-radio>
          <a-radio :value="0">导入</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- 图文新建 -->
      <template v-if="sketch.addType == 1">
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }">
          <template slot="label"><span
              style="color: red">*</span>图文链接
          </template>
          <a-input
              @blur="inputChange(sketchIndex)"
							:allowClear="true"
							@change="urlChange(sketchIndex)"
              @keyup.enter="inputChange(sketchIndex)"
              placeholder="请输入图文链接，且必须以http://或https://开头"
              style="margin-bottom: 10px;"
              v-model="sketch.content_source_url"></a-input>
          <div class="content_input" v-if="sketch.showTextContent">
            <div style="flex-grow: 1;height: 100px;">
              <div class="input_text1">{{sketch.inputTitle}}
              </div>
              <div class="input_text2">
                {{sketch.digest}}
              </div>
            </div>
            <div style="width: 100px;height: 100px;padding: 10px">
	    <img class="input_img" v-if="sketch.closeShowModal3 && sketch.local_path.img"
                   :src="sketch.local_path.img"
                   alt=""/>
		   <!--							<img v-if="sketch.local_path.img==''"-->
		   <!--							     class="input_img"-->
		   <!--							     src="../../assets/url.png" alt=""/>-->
            </div>
          </div>
        </a-form-item>
        <a-form-model-item label="高级设置" v-if="sketch.showTextContent"
                           :label-col="{ span:3 }"
                           :wrapper-col="{ span: 18 }">
          <a-switch v-model="sketch.isAdvance"/>
        </a-form-model-item>
        <template v-if="sketch.isAdvance && sketch.showTextContent">
          <!-- 图片封面 -->
          <!-- 选中前 -->
          <a-form-item :label-col="{ span: 4 }"
                       :wrapper-col="{ span: 20 }"
                       v-show="sketch.closeShowModal3==false">
            <template slot="label"><span
                style="color: red">*</span>图片封面
            </template>
            <div class="upload-wrap"
                 @click="openShowModal(sketchIndex)">
              <a-icon type="plus" class="upload-plus"/>
            </div>
          </a-form-item>
          <!-- 选中后 -->
          <a-form-item label="图片封面" :label-col="{ span: 4 }"
                       :wrapper-col="{ span: 20 }"
                       v-show="sketch.closeShowModal3">
            <div class="upload-wrap"
                 @click="openShowModal(sketchIndex ,sketch.material_id)">
              <img :src="sketch.local_path.img" alt=""
                   class="upload-wrap-pic">
            </div>
            <span
                style="color: blue;position: absolute;bottom: 0;left: 110px;cursor: pointer;"
                @click="openShowModal(sketchIndex,sketch.material_id)">重新上传</span>
          </a-form-item>
          <!-- 填写标题 -->
          <a-form-item :label-col="{ span: 4 }"
                       :wrapper-col="{ span: 20 }">
            <template slot="label"><span
                style="color: red">*</span>填写标题
            </template>
            <a-input v-model="sketch.inputTitle" class="padding-r"
                     :maxLength="32">
																<span slot="suffix">
                    <span>{{sketch.inputTitle.length}}</span>/32
                  </span>
            </a-input>
          </a-form-item>
          <!-- 添加描述 -->
          <a-form-item label="添加描述" :label-col="{ span: 4 }"
                       :wrapper-col="{ span: 20 }">
            <a-textarea placeholder="填写图文描述" :rows="4"
                        style="resize: none;"
                        v-model="sketch.digest"
                        :maxLength="128"/>
            <div style="float:right;">
              <span>{{sketch.digest.length}}</span>/128
            </div>
          </a-form-item>
        </template>
        <!-- 素材同步 -->
        <a-form-item label="素材同步" :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }">
          <a-radio-group
              @change="changeMaterialSync(sketchIndex)"
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
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }">
          <a-button
              @click="deleteSketch(sketchIndex)">
            删除该条
          </a-button>
        </a-form-item>
      </template>
      <!-- 图文导入 -->
      <template v-if="sketch.addType == 0">
        <!-- 选中前 -->
        <a-form-item :label-col="{ span: 3 }"
                     :wrapper-col="{ span: 21 }"
                     v-show="sketch.closeShowModal3==false">
          <template slot="label"><span
              style="color: red">*</span>图文
          </template>
          <div class="upload-border"
               @click="openShowModal(sketchIndex)">
            <a-icon type="plus" class="upload-plus"/>
            <span>选择图文</span>
          </div>
          <!--																	<a-button type="primary" ghost-->
          <!--																	          style="margin-right: 15px;"-->
          <!--																	          @click="addSketch(sketchIndex)"-->
          <!--																	          v-show="sketch.addSketchVisible && item.pushHour==0 && item.pushMinutes == 0">-->
          <!--																		<a-icon type="plus"/>-->
          <!--																		添加图文-->
          <!--																	</a-button>-->
          <a-button
              @click="deleteSketch(sketchIndex)">
            删除该条
          </a-button>
        </a-form-item>
        <!-- 选中后 -->
        <a-form-item :label-col="{ span: 3 }"
                     :wrapper-col="{ span: 21 }"
                     v-show="sketch.closeShowModal3">
          <template slot="label"><span
              style="color: red">*</span>图文
          </template>
          <div class="upload-border"
               @click="openShowModal(sketchIndex,sketch.material_id)">
            <img src="../../assets/circle.png" alt/>
            已选择1条图文
            <p style="color: blue;margin: 14px;"
               @click="openShowModal(sketchIndex,sketch.material_id)">
              [修改]</p>
          </div>
          <!--																	<a-button type="primary" ghost-->
          <!--																	          style="margin-right: 15px;"-->
          <!--																	          @click="addSketch(sketchIndex)"-->
          <!--																	          v-show="sketch.addSketchVisible && item.pushHour==0 && item.pushMinutes == 0">-->
          <!--																		<a-icon type="plus"/>-->
          <!--																		添加图文-->
          <!--																	</a-button>-->
          <a-button
              @click="deleteSketch(sketchIndex)">
            删除该条
          </a-button>
        </a-form-item>
      </template>
    </template>
    <template v-if="msgObj.typeValue && msgObj.typeValue == 2">
      <!-- 上传图片 -->
      <!-- 选中前 -->
      <a-form-item label="上传图片" :label-col="{ span: 3 }"
                   :wrapper-col="{ span: 21 }"
                   v-show="msgObj.closeShowModal3==false">
        <div class="upload-wrap"
             style="display: inline-block"
             @click="openShowModal">
          <a-icon type="plus" class="upload-plus"/>
        </div>
<!--        <span style="vertical-align: bottom;">（图片大小不超过2M，支持JPG、JPEG及PNG格式）</span>-->
        <div>
          <a-button @click="deleteMaterial()">删除该条
          </a-button>
        </div>
      </a-form-item>
      <!-- 选中后 -->
      <a-form-item label="上传图片" :label-col="{ span: 3 }"
                   :wrapper-col="{ span: 21 }"
                   v-show="msgObj.closeShowModal3">
        <div class="upload-wrap"
             @click="openShowModal(0,msgObj.material_id)">
          <img :src="msgObj.local_path.img" alt=""
               class="upload-wrap-pic">
        </div>
        <span
            style="color: blue;position: absolute;bottom: 30px;left: 110px;cursor: pointer;"
            @click="openShowModal(0,msgObj.material_id)">重新上传</span>
        <a-button style="display: block;margin-top: 10px;"
                  @click="deleteMaterial()">
          删除该条
        </a-button>
      </a-form-item>
    </template>
    <template v-if="msgObj.typeValue && msgObj.typeValue == 1">
			<!-- 文本消息 -->
			<a-form-item v-if="typeof msgObj.isTextAdd != 'undefined' && msgObj.isTextAdd == false" label="添加方式" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }">
				<a-radio-group name="radioGroup" @change="changeAddType(-2)" key="applet"
				               v-model="msgObj.addType">
					<a-radio :value="1">新建</a-radio>
					<a-radio :value="0">导入</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="文本消息" :label-col="{ span: 3 }"
                   :wrapper-col="{ span: 21 }">
				<editor v-if="msgObj.addType == 1" :text="msgObj.textContent"
                :textValue="msgObj.textAreaValueHeader"
                 :wordLimit="600"
                  :isMenu="true"
				        :isNickName="typeof msgObj.isNickName != 'undefined' ? msgObj.isNickName : true"
                @changeText="changeText">
        </editor>
				<!-- 文本 -->
				<!-- 选中前 -->
				<template v-if="msgObj.addType == 0">
					<template v-if="msgObj.closeShowModal3==false">
						<div class="upload-border" @click="openShowModal">
							<a-icon type="plus" class="upload-plus"/>
							<span>选择文本消息</span>
						</div>
					</template>
					<!-- 文本 -->
					<template v-if="msgObj.closeShowModal3 == true">
						<div class="upload-border"
						     @click="openShowModal(0,msgObj.material_id)">
							<img src="../../assets/circle.png" alt/>
							已选择1条文本
							<p style="color: blue;margin: 14px;"
							   @click="openShowModal(0,msgObj.material_id)">
								[修改]</p>
						</div>
					</template>
				</template>
        <a-button @click="deleteMaterial()">删除该条
        </a-button>
      </a-form-item>
    </template>
    <template v-if="msgObj.typeValue && msgObj.typeValue == 3">
      <!-- 语音 -->
      <!-- 选中前 -->
      <a-form-item label="语音" :label-col="{ span: 3 }"
                   :wrapper-col="{ span: 21 }"
                   v-show="msgObj.closeShowModal3==false">
        <div class="upload-border" @click="openShowModal">
          <a-icon type="plus" class="upload-plus"/>
          <span>选择音频消息</span>
        </div>
        <a-button @click="deleteMaterial()">删除该条
        </a-button>
      </a-form-item>
      <!-- 选中后 -->
      <a-form-item label="语音" :label-col="{ span: 3 }"
                   :wrapper-col="{ span: 21 }"
                   v-show="msgObj.closeShowModal3">
        <div class="upload-border"
             @click="openShowModal(0,msgObj.material_id)">
          <img src="../../assets/circle.png" alt/>
          已选择1条语音
          <p style="color: blue;margin: 14px;"
             @click="openShowModal(0,msgObj.material_id)">
            [修改]</p>
        </div>
        <a-button @click="deleteMaterial()">删除该条
        </a-button>
      </a-form-item>
    </template>
    <template v-if="msgObj.typeValue && msgObj.typeValue == 4">
      <!-- 视频 -->
      <!-- 选中前 -->
      <a-form-item label="视频" :label-col="{ span: 3 }"
                   :wrapper-col="{ span: 21 }"
                   v-show="msgObj.closeShowModal3==false&&isVideoLoading==false">
        <div class="upload-border" @click="openShowModal">
          <a-icon type="plus" class="upload-plus"/>
          <span>选择视频消息</span>
        </div>
        <a-button @click="deleteMaterial()">删除该条
        </a-button>
      </a-form-item>
    <!--    选择等待中  -->
      <a-form-item label="获取中" :label-col="{ span: 3 }"
                   :wrapper-col="{ span: 21 }"
                   v-show="isVideoLoading"
                 >
        <a-spin :spinning="isVideoLoading"  size="small"  class="save-loading"/>
      </a-form-item>
      <!-- 选中后 -->
      <a-form-item label="视频" :label-col="{ span: 3 }"
                   :wrapper-col="{ span: 21 }"
                   v-show="msgObj.closeShowModal3&&isVideoLoading==false">
        <div class="upload-border"
             @click="openShowModal(0,msgObj.material_id)">
          <img src="../../assets/circle.png" alt/>
          已选择1条视频
          <p style="color: blue;margin: 14px;"
             @click="openShowModal(0,msgObj.material_id)">
            [修改]</p>
        </div>
        <a-button @click="deleteMaterial()">删除该条
        </a-button>
      </a-form-item>
    </template>
		<template v-if="msgObj.typeValue && msgObj.typeValue == 7">
			<!-- 文件 -->
			<!-- 选中前 -->
			<a-form-item label="文件" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }"
			             v-show="msgObj.closeShowModal3==false">
				<div class="upload-border" @click="openShowModal">
					<a-icon type="plus" class="upload-plus"/>
					<span>选择文件消息</span>
				</div>
				<a-button @click="deleteMaterial()">删除该条
				</a-button>
			</a-form-item>
			<!-- 选中后 -->
			<a-form-item label="文件" :label-col="{ span: 3 }"
			             :wrapper-col="{ span: 21 }"
			             v-show="msgObj.closeShowModal3">
				<div class="upload-border"
				     @click="openShowModal(0,msgObj.material_id)">
					<img src="../../assets/circle.png" alt/>
					已选择1个文件
					<p style="color: blue;margin: 14px;"
					   @click="openShowModal(0,msgObj.material_id)">
						[修改]</p>
				</div>
				<a-button @click="deleteMaterial()">删除该条
				</a-button>
			</a-form-item>
		</template>
    <template v-if="msgObj.typeValue && msgObj.typeValue == 6">
         <a-form-item v-if="typeof msgObj.isAppletAdd == 'undefined' || msgObj.isAppletAdd" label="添加方式" :label-col="{ span: 3 }"
                   :wrapper-col="{ span: 21 }">
        <a-radio-group name="radioGroup" @change="changeAddType(-1)" key="applet"
                       v-model="msgObj.addType">
          <a-radio :value="1">新建</a-radio>
          <a-radio :value="0">导入</a-radio>
        </a-radio-group>
      </a-form-item>
      <template v-if="msgObj.addType == 1">
        <div class="content-msg" style="margin-bottom: 10px;">
          <p style="margin-bottom: 2px;line-height: 20px;">
	  在<template v-if="menuType == 1">企业微信</template><template v-else-if="menuType==0">公众号</template>里发送小程序（必须在微信公众平台通过审核和发布的），请先将其关联到<template v-if="menuType == 1">企业微信</template><template v-else-if="menuType==0">公众号</template>
            ，再到本系统添加该小程序，否则发送失败，客户接收不到。
          </p>
          <p style="margin-bottom: 2px;line-height: 20px;">
            如果没有微信小程序，请前往微信小程序进行注册。
            <a target="_blank" href="https://mp.weixin.qq.com/cgi-bin/wx">
              立即前往
            </a>
          </p>
          <p style="margin-bottom: 0px;color: #FF562D; line-height: 20px;">
            小程序路径必须以“.html”结尾。
          </p>
        </div>
        <!-- 图片封面 -->
        <!-- 选中前 -->
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     v-show="msgObj.closeShowModal3==false">
          <template slot="label"><span
              style="color: red">*</span>图片封面
          </template>
          <div class="upload-wrap" style="display: inline-block"
               @click="openShowModal(0, msgObj.material_id)">
            <a-icon type="plus" class="upload-plus"/>
          </div>
<!--          <span style="display: inline-block; line-height: 22px;">（上传图片不超过1M，尺寸必须为1080*864像素，支持jpg/jpeg/png格式）</span>-->
        </a-form-item>
        <!-- 选中后 -->
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     v-show="msgObj.closeShowModal3">
          <template slot="label"><span
              style="color: red">*</span>图片封面
          </template>
          <div class="upload-wrap">
            <img :src="msgObj.appletUrl" alt=""
                 style="max-width: 100%;max-height: 100%;margin-left: 50%;margin-top: 50%;transform: translate(-50%, -50%);">
          </div>
          <span
              style="color: blue;cursor: pointer;margin: 0 0 0 10px;float: left;"
              @click="openShowModal(0, msgObj.material_id)">重新上传</span>
        </a-form-item>
        <!-- 填写标题 -->
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }">
          <template slot="label"><span
              style="color: red">*</span>填写标题
          </template>
          <a-input v-model="msgObj.appletInputTitle"
                   :maxLength="12" placeholder="请填写小程序标题（4-12个字符）"
                   @blur="checkout(msgObj.appletInputTitle)">
																	<span slot="suffix">
	                    <span>{{msgObj.appletInputTitle.length}}</span>/12
	                  </span>
          </a-input>
        </a-form-item>
        <!-- appid -->
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }">
          <template slot="label"><span
              style="color: red">*</span>AppID
          </template>
          <a-input v-model="msgObj.appid" :placeholder="tip[0]"/>
        </a-form-item>
        <!-- page路径 -->
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }">
          <template slot="label"><span
              style="color: red">*</span>page路径
          </template>
          <a-input style="margin-bottom: 10px;"
                   v-model="msgObj.pageUrl" :placeholder="tip[1]">
          </a-input>
        </a-form-item>
        <a-form-item label="素材同步" :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }">
          <a-radio-group
              v-model="msgObj.materialSync" @change="changeAppletSync"
              :disabled="msgObj.disabledSync == 1 ? true : false">
            <a-radio :value="0">不同步</a-radio>
            <a-radio :value="1"
                     :style="{ 'display': msgObj.materialSync == 1 ? 'block' : '' }">
              同步至【内容引擎】
              <div v-show="msgObj.materialSync == 1"
                   style="margin-top: 10px;">
                选择分组：
                <a-tree-select
                    style="width: 225px"
                    :dropdownStyle="{ maxHeight: '150px', overflow: 'auto' }"
                    :treeData="groupList"
                    placeholder='Please select'
                    treeDefaultExpandAll
                    v-model="msgObj.selectGroupId"
                >
                </a-tree-select>
              </div>
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </template>
      <template v-if="msgObj.addType == 0">
        <!-- 选中前 -->
        <a-form-item :label-col="{ span: 3 }"
                     :wrapper-col="{ span: 21 }"
                     v-show="!msgObj.closeShowModal3">
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
                     v-show="msgObj.closeShowModal3">
          <template slot="label"><span
              style="color: red">*</span>小程序
          </template>
          <div class="upload-border"
               @click="openShowModalMinipro()">
            <img src="../../assets/circle.png" alt/>
            已选择1条小程序
            <p style="color: blue;margin: 14px;"
               @click="openShowModalMinipro()">
              [修改]</p>
          </div>
        </a-form-item>
      </template>
      <a-button @click="deleteMaterial()">删除该条
      </a-button>
    </template>
    <!-- 选择消息弹窗 -->
		<chooseMsg :showRadar="!!msgObj.showRadar" :show="showModal3" :type="typeValue2" :news_type="news_type"
               :callback="modalVisibleChange2" :chooseId="chooseId"></chooseMsg>
    <!-- 小程序封面图片裁剪 -->
    <cropperModal ref="cropper" @ok="uploadAppletPic" @cancel="cancleAppletPic"></cropperModal>
    <!-- 选择小程序 -->
    <chooseMinipro :show="showModalMinipro" :type="typeValue2"
                   :callback="modalVisibleChange2" :chooseId="chooseId"></chooseMinipro>
  </div>
</template>

<script>
import {defaulImg} from '../../assets/img.png'
import chooseMsg from "@/components/ChooseMsg.vue"
import editor from '@/components/editor/index'
import cropperModal from '@/components/picCropper/CropperModal'
import chooseMinipro from '@/components/FilingCabinet/Miniprogram.vue'
import {mapGetters} from 'vuex';
import _ from 'lodash'
export default {
  name      : "Home",
  components: {
    chooseMsg, editor, cropperModal, chooseMinipro
  },
  props     : {
    msg: {
      type   : Object,
      default: ()=>{}
    },
    tip:{
      type:Array,
      default: ()=>['请填写小程序AppID，必须是关联到企业的小程序应用','请填写小程序AppID，必须是关联到企业的小程序应用']
    }
  },
  data () {
    return {
      isVideoLoading:false,//选中的视频回显中
      menuType        : localStorage.getItem('type'), // 0、公众号 1、企业微信
      msgObj          : {}, // 内容对象
      groupList       : [], // 内容引擎分组
      typeValue2      : 1, //传给子组件的type值，获取素材接口1为图文，所以要将传给子组件的type值改成1
      news_type       : null,//给组件传值，1为单图文
      chooseId        : 0,//跳入组件时，选择好的id
      showModal3      : false, //选择消息对话框的显示与隐藏
      currentSketch   : 0,//当前选中的图文中新建的模块的index值
      commonUrl       : this.$store.state.commonUrl, //公共的链接
      showModalMinipro: false, // 小程序弹窗是否显示
      isAdvance       : false, // 高级设置内容是否显示
    }
  },
  watch     : {
    msg: {
      handler (newVal) {
        this.msgObj = newVal
      },
      deep: true //对象内部属性的监听，关键。
    },
    msgObj: {
      handler (newVal) {
          this.$emit('changeMsg', newVal)

      },
      deep: true //对象内部属性的监听，关键。
    }
  },
  computed: {
    ...mapGetters({
      currentMenu: 'getCurrentMenu',
      activeMenu: 'getActiveMenu',
      menulist: 'getMenuList'
    })
  },
  mounted () {
    this.msgObj = this.msg

    this.getGroupList()
  },
  methods   : {
    //更换消息类型
    changeTypeValue () {
      this.msgObj.closeShowModal3 = false
      this.msgObj.appid=''
      this.msgObj.appletInputTitle=''
      this.msgObj.appletUrl=''
      this.msgObj.pageUrl=''
      this.msgObj.sketchList = this.msgObj.sketchList.slice(0, 1)
      this.msgObj.sketchList[0].closeShowModal3 = false
      this.msgObj.sketchList[0].local_path.img = require('../../assets/img.png')
      this.msgObj.sketchList[0].local_path.audio = ''
      this.msgObj.sketchList[0].inputTitle = ''
      this.msgObj.sketchList[0].digest = ''
      this.msgObj.sketchList[0].content_source_url = ''
      this.msgObj.sketchList[0].materialSync = 0
      this.msgObj.sketchList[0].selectGroupId = ''
      this.msgObj.sketchList[0].showTextContent = false
      this.msgObj.local_path.img = ''
      this.msgObj.local_path.audio = ''
      this.msgObj.closeShowModal3 = false
      this.msgObj.material_id = ''
      this.msgObj.sketchList[0].material_id = 0
      this.msgObj.textAreaValueHeader = ''
      this.msgObj.textContent = ''
      if(this.msgObj.typeValue == 5 && typeof this.msgObj.isSketchAdd != 'undefined' && !this.msgObj.isSketchAdd) {
      this.msgObj.sketchList[0].addType = 0
      } else if (this.msgObj.typeValue == 6 && typeof this.msgObj.isAppletAdd != 'undefined' && !this.msgObj.isAppletAdd) {
      this.msgObj.addType = 0
      } else if (this.msgObj.typeValue == 1 && typeof this.msgObj.isTextAdd != 'undefined' && this.msgObj.isTextAdd) {
      this.msgObj.addType = 0
      } else {
      this.msgObj.addType = 1
      }
    },
    //更换添加方式
    changeAddType (sketchIndex) {
      if (sketchIndex != -1) {
        this.msgObj.sketchList[sketchIndex].closeShowModal3 = false
        this.msgObj.sketchList[sketchIndex].local_path.img = defaulImg
        this.msgObj.sketchList[sketchIndex].local_path.audio = ''
        this.msgObj.sketchList[sketchIndex].inputTitle = ''
        this.msgObj.sketchList[sketchIndex].digest = ''
        this.msgObj.sketchList[sketchIndex].content_source_url = ''
        this.msgObj.sketchList[sketchIndex].material_id = ''
        this.msgObj.sketchList[sketchIndex].materialSync = 0
        this.msgObj.sketchList[sketchIndex].selectGroupId = ''
        this.msgObj.sketchList[sketchIndex].showTextContent = false
				} else if(sketchIndex == -2) {
					this.msgObj.closeShowModal3 = false
					this.msgObj.textAreaValueHeader = ''
					this.msgObj.textContent = ''
					this.msgObj.material_id = ''
					this.$forceUpdate()
      } else {
        this.msgObj.closeShowModal3 = false
        this.msgObj.appletUrl = ''
        this.msgObj.appletInputTitle = ''
        this.msgObj.appid = ''
        this.msgObj.pageUrl = ''
        this.msgObj.materialSync = 0
        this.msgObj.selectGroupId = ''
        this.msgObj.material_id = ''
        this.$forceUpdate()
      }

    },
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
      if (this.msgObj.typeValue == 5 && this.msgObj.sketchList[sketchIndex].addType == 1) {
        this.typeValue2 = 2
      } else if (this.msgObj.typeValue == 5) {
        this.typeValue2 = 1
        this.news_type = 1
      } else if (this.msgObj.typeValue == 6) {
        this.typeValue2 = 2
				} else if (this.msgObj.typeValue == 7) {
					this.typeValue2 = 5
				} else if (this.msgObj.typeValue == 1) {
					this.typeValue2 = 6
      } else {
        this.typeValue2 = this.msgObj.typeValue
      }
    },
			urlChange(index) {
				let that = this
				setTimeout(function () {
					let url = that.msgObj.sketchList[index].content_source_url || that.msgObj.sketchList[index].content_source_url == 0 ? that.msgObj.sketchList[index].content_source_url : ''
					if (url === '') {
						that.msgObj.sketchList[index].showTextContent = false
						that.msgObj.sketchList[index].closeShowModal3 = false
					}
				}, 500)
			},
    inputChange (index) {
      let url = this.msgObj.sketchList[index].content_source_url ? this.msgObj.sketchList[index].content_source_url : ''
      if (url && url !== '') {
        this.getTextInfo(url, index)
      } else {
        this.msgObj.sketchList[index].showTextContent = false
					this.msgObj.sketchList[index].closeShowModal3 = false
      }
    },
    async getTextInfo (url, index) {
      const {data: res} = await this.axios.post('moment/moments-images-text', {
        corp_id: localStorage.getItem('corpId'),
        url: url
      })
      if (res.error != 0) {
        this.$message.destroy()
        // this.$message.error(res.error_msg);
        this.msgObj.sketchList[index].showTextContent = false
      } else {
        this.msgObj.sketchList[index].showTextContent = true
					if (res.data.url == '') {
						this.msgObj.sketchList[index].local_path.img = ''
						this.msgObj.sketchList[index].isAdvance = true
						this.msgObj.sketchList[index].closeShowModal3 = false
					} else {
        this.msgObj.sketchList[index].local_path.img = this.commonUrl + res.data.url
						this.msgObj.sketchList[index].closeShowModal3 = true
					}
        this.msgObj.sketchList[index].inputTitle = res.data.title
        this.msgObj.sketchList[index].digest = res.data.description
      }
    },
    checkout (title) {
      if (title.length < 4) {
        // this.$message.warning('小程序标题长度需在4-12个字符')
      }
    },
    changeText (text, textVale) {
      this.msgObj.textContent = text
      this.msgObj.textAreaValueHeader = textVale
    },
    //图文删除该条按钮
    deleteSketch (sketchIndex) {
      this.$emit('deleteMsg', sketchIndex)
    },
    //图片、音频、视频删除该条按钮
    deleteMaterial () {
      this.$emit('deleteMsg')
    },
    // 小程序同步
    changeAppletSync () {
      if (this.msgObj.materialSync == 1) {
        this.getGroupList()
      }
    },
    //素材同步
    changeMaterialSync (sketchIndex) {
      if (this.msgObj.sketchList[sketchIndex].materialSync == 1) {
        this.getGroupList(sketchIndex)
      }
    },
    // 打开小程序弹窗
    openShowModalMinipro () {
      if (this.msgObj.material_id) {
        this.chooseId = Number(this.msgObj.material_id)
      } else {
        this.chooseId = 0
      }
      this.typeValue2 = 7
      this.showModalMinipro = true
    },
    //获取分组列表
    async getGroupList (sketchIndex) {
      const isNullOrUndefined = obj => obj === null || obj === undefined;
      const {data: res} = await this.axios.post("attachment/group", {
        uid       : localStorage.getItem('uid'),
        is_channel: 1
      });
      if (res.error != 0) {
        this.$message.destroy()
        this.$message.error(res.error_msg);
      } else {
        this.groupList = res.data.group
        if (!isNullOrUndefined(sketchIndex)) {
						if (!this.msgObj.sketchList[sketchIndex].selectGroupId) {
          this.msgObj.sketchList[sketchIndex].selectGroupId = this.groupList[0].key
						}
        } else {
						if (!this.msgObj.selectGroupId) {
         
            this.msgObj.selectGroupId = this.groupList[0].key
          

          }
        }
      }
    },
    modalVisibleChange2 (event, e, id, item) {
      if (event == "ok") {
        if (isNaN(id) || id == '') {
          this.$message.error('请选择素材')
          this.showModal3 = false
						this.showModalMinipro = false
        } else {
						if (this.msgObj.typeValue == 1) {
							this.showModal3 = false
							this.msgObj.closeShowModal3 = true
							this.msgObj.textContent = item.content
							this.msgObj.textAreaValueHeader = item.content
							this.msgObj.material_id = id
						} else if (this.msgObj.typeValue == 6) {
            if (this.msgObj.addType == 0) {
              this.getOneMaterial(id)
            } else {
              this.$refs.cropper.edit(item.local_path, item.file_name)
              this.showModal3 = false
            }
          } else {
            this.getOneMaterial(id)
          }
						this.showModalMinipro = false
        }
      } else {
        this.showModal3 = false
        this.showModalMinipro = false
      }
    },
    cancleAppletPic () {
    },
    uploadAppletPic (id) {
      this.uploadMedia(id)
    },
    //上传素材，将素材传给微信
    async uploadMedia (id) {
				let params = {}
				let url = ''
				if (this.menuType == 0) {
					url = 'material/upload-media'
					params = {
        wx_id        : localStorage.getItem('wxNum'),
        attachment_id: id
					}
				} else {
					url = 'work-material/upload-media'
					params = {
						corp_id      : localStorage.getItem('corpId'),
						attachment_id: id
					}
					if(this.msgObj.typeValue == 5) {
						params['type'] = 4
					}
				}
				const {data: res} = await this.axios.post(url, params);
      if (res.error != 0) {
        this.$message.error(res.error_msg);
      } else {
        if (isNaN(id) || id == '') {
          this.$message.error('请选择素材')
        } else {
						let materialList = {}
          this.msgObj.material_id = id
						if (this.menuType == 0) {
							materialList = res.data[id]
						} else {
							materialList = res.data
						}
						this.msgObj.appletUrl = materialList.local_url || this.commonUrl + materialList.local_path
          this.msgObj.closeShowModal3 = true
          this.showModal3 = false
        }
      }
    },
    //根据组件返回的id获取单个素材信息
    async getOneMaterial (id) {
				let params = {}
				let url = ''
				if (this.menuType == 0) {
					url = 'material/upload-media'
					params = {
        wx_id        : localStorage.getItem('wxNum'),
        attachment_id: id
					}
				} else {
					url = 'work-material/upload-media'
					params = {
						corp_id      : localStorage.getItem('corpId'),
						attachment_id: id
					}
					if(this.msgObj.typeValue == 5) {
						params['type'] = 4
					}
				}
				console.log( this.showModal3,'111111111' )
        this.isVideoLoading=true
				const {data: res} = await this.axios.post(url, params)
      console.log( this.showModal3 ,'22222222')
      this.isVideoLoading=false
      // console.log(res)
      if (res.error == 0) {
        this.showModal3 = false
        this.msgObj.closeShowModal3 = true
					let materialList = {}
					if (this.menuType == 0) {
						materialList = res.data[id]
					} else {
						materialList = res.data
					}
        if (this.msgObj.typeValue == 5) {
          this.msgObj.sketchList[this.currentSketch].material_id = id
        } else {
          this.msgObj.material_id = id
        }
        if (this.msgObj.typeValue == 5 && this.msgObj.sketchList[this.currentSketch].addType == 1) {
						this.msgObj.sketchList[this.currentSketch].local_path = JSON.parse(JSON.stringify({img: this.commonUrl + materialList.local_path}))
						// this.msgObj.sketchList[this.currentSketch].local_path.img = this.commonUrl + materialList.local_path
          this.msgObj.sketchList[this.currentSketch].closeShowModal3 = true
        } else if (this.msgObj.typeValue == 5 && this.msgObj.sketchList[this.currentSketch].addType == 0) {
          this.msgObj.sketchList[this.currentSketch].material_id = materialList.id
          this.msgObj.sketchList[this.currentSketch].closeShowModal3 = true
						this.msgObj.sketchList[this.currentSketch].local_path.img = this.commonUrl + materialList.artList[0].qy_local_path
          this.msgObj.sketchList[this.currentSketch].inputTitle = materialList.artList[0].title
          this.msgObj.sketchList[this.currentSketch].digest = materialList.artList[0].digest
          this.msgObj.sketchList[this.currentSketch].content_source_url = materialList.artList[0].content_source_url
          this.msgObj.sketchList[this.currentSketch].materialSync = materialList.artList[0].is_sync
          this.msgObj.sketchList[this.currentSketch].selectGroupId = materialList.artList[0].group_id
        } else if (this.msgObj.typeValue == 4) {
          this.msgObj.file_name = materialList.file_name
         
        } else if (this.msgObj.typeValue == 3) {
          this.msgObj.local_path.audio = this.commonUrl + materialList.local_path
          this.msgObj.file_name = materialList.file_name
        
        } else if (this.msgObj.typeValue == 6) {
          this.msgObj.appletUrl = materialList.local_url
          this.msgObj.appletInputTitle = materialList.file_name
					} else if(this.msgObj.typeValue == 7) {
						this.msgObj.extension = materialList.extension
						this.msgObj.file_name = materialList.file_name
        } else {
          this.msgObj.local_path.img = this.commonUrl + materialList.local_path
          this.msgObj.file_name = materialList.file_name
          
        }
      } else {
        this.$message.error(res.error_msg)
      }
      // console.log(materialList)
    }
  }
}
</script>

<style scoped>
.content-msg {
  width: 100%;
  border: 1px solid #FFDDA6;
  background: #FFF2DB;
  padding: 10px;
  /*margin-top: 12px;*/
  text-align: left;
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

.upload-wrap-pic {
  max-width: 80px;
  max-height: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
.content_input {
  background: #FFF;
  min-width: 378px;
  height: 100px;
  margin-top: 5px;
  display: flex;
  border: 1px solid #e2e2e2;
}
.content_input {
  background: #FFF;
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
/deep/.padding-r .ant-input:not(:last-child){
  padding-right: 60px;
}
</style>