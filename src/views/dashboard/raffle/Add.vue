<template>
	<div class="fission-add">
		<a-card style="margin-bottom:20px;padding:10px 20px;">
			<label style="font-size: 16px;line-height: 32px;">
				<span v-if="id == ''">新建</span>
				<span v-else>编辑</span>抽奖引流</label>
			<a-button type="primary"  style="font-size: 14px;float: right;" @click="goBack">返回列表
			</a-button>
		</a-card>
		<div class="content-msg" style="margin: 0 20px;" v-if="raffleNum > 0">
			当前套餐版本仅支持<span style="color: red;">单场活动</span>用户参与人数上限<span style="color: red;">{{raffleNum}}</span>人，达到上限后活动将自动结束。更多套餐信息可联系平台了解哦！
		</div>
		<div class="fission-content">
			<div class="img-left left-sider-content">
				<img :src="mobileImg" alt="" style="width: 100%;" v-if="current != 4 && current != 5">
				<div v-if="current == 5"
				     style="height: 100%;border: 1px solid #E2D6D6;background: #F5F5F5;overflow-y: auto;">
					<img src="../../../assets/wxHeader.png" alt
					     style="width:100%;border-bottom:1px solid #E2D6D6;"/>
					<div class="msg_content_body">
						<!--文本-->
						<div class="mt" v-if="textAreaValueHeader">
							<a-avatar
									src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									:size="36" style="margin-right: 10px;float: left;"/>
							<span v-html="textAreaValueHeader" class="item-info msg_content_txt"></span>
						</div>
						<!--网址-->
						<div class="mt" v-if="link_pic_url || link_start_title || link_desc">
							<a-avatar
									src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									:size="36" style="margin-right: 10px;float: left;"/>
							<div class="item-info msg_content_txt">
								<p class="url-title">{{link_start_title}}</p>
								<div style="overflow: hidden;">
									<div class="url-text">{{link_desc}}</div>
									<img :src="commonUrl + link_pic_url" alt=""
									     style="float: right;width: 64px;height: 64px;object-fit: cover;">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-if="current == 4">
					<!-- 更改海报时改变menuKey重新渲染 -->
					<div style="width: 266px;border: 8px solid rgb(241, 241, 241);" :key="menuKey"
					     :style="{height: (backHeight + 18) + 'px'}">
						<div class="page-content" :style="{ 'height': backHeight + 'px' }">
							<img v-show="back_pic_url" style="max-width: 100%;position: absolute;" draggable="false"
							     :src="commonUrl + back_pic_url"/>
							<vue-draggable-resizable
									v-if="is_avatar"
									style="cursor: move;"
									:class="shape=='circle'? 'radus' : ''"
									:x="avatar.x"
									:y="avatar.y"
									:w="avatar.w"
									:h="avatar.w"
									:z="9999"
									:lock-aspect-ratio="true"
									@dragging="onDragAvatar"
									@resizing="onResizeAvatar"
									:parent="true">
								<span style="display:inline-block; position: absolute;left: 50%; top: 50%; transform: translate(-50%, -50%);font-size: 12px;color: #BFBFBF;">头像</span>
							</vue-draggable-resizable>
							<div style="border: 0px; position: absolute; left: 68px; top: 176px;"
							     v-if="!back_pic_url">
								<a-upload v-if="!back_pic_url"
								          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
								          :showUploadList="false"
								          :beforeUpload="beforeUpload"
								>
									<!--									@change="uploadImage"-->
									<div>
										<a-button>
											<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
											上传海报
										</a-button>
									</div>
								</a-upload>
							</div>
							<vue-draggable-resizable
									style="cursor: move;"
									v-if="is_nickname"
									:x="nickName.x"
									:y="nickName.y"
									:w="nickNameWidth()"
									:h="nickNameHeight()"
									:z="9999"
									:resizable="false"
									:style="nickNameStyle()"
									@dragging="onDragNickName"
									:parent="true">
								昵称
							</vue-draggable-resizable>
							<vue-draggable-resizable
									style="cursor: move;"
									:x="qrCode.x"
									:y="qrCode.y"
									:w="qrCode.w"
									:h="qrCode.w"
									:z="9999"
									:lock-aspect-ratio="true"
									@dragging="onDragQrcode"
									@resizing="onResizeQrcode"
									:parent="true">
								<img :style="{width: qrCode.w + 'px', height: qrCode.w + 'px'}"
								     src="../../../assets/fission/add/code.png">
							</vue-draggable-resizable>
						</div>
					</div>
				</div>
			</div>
			<div class="steps-content">
				<a-steps :current="current" style="padding: 0 30px;cursor: pointer;">
					<a-step @click="changeCurrent(index)" v-for="(item, index) in steps" :key="item.title"
					        :title="item.title"/>
				</a-steps>
				<div v-show="current == 0" style="margin: 20px;">
					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">活动信息</span>
					<a-divider/>
					<a-form-item v-if="$store.state.corpArr.length > 1" class="current0"
					             :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>选择企业微信
						</template>
						<template>
							<div style="display: inline-block;cursor: pointer;" @click="changeCorp">
								<img src="../../../assets/WeChatLogo.png"
								     style="width: 24px;margin: -3px 6px 0 0;"/>
								<span>{{corpName}}</span>
								<a-icon type="caret-down"
								        style="width: 50px;height: 40px;text-align: left;line-height: 40px;margin-left: 20px;"
								        v-if="currentStatus != 1"/>
							</div>
							<span style="color: #F56C6C;">（一旦创建，不可修改）</span>
						</template>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>选择应用
						</template>
						<template>
							<a-select
									:disabled="currentStatus == 1"
									showSearch
									optionFilterProp="children"
									style="width: 200px;"
									v-model="agent_id" placeholder="请选择应用">
								<template v-for="item in agentList">
									<a-select-option :value="item.id">{{item.name}}
									</a-select-option>
								</template>
							</a-select>
							<span style="color: #F56C6C">（一旦发布，不可更改）</span>
							<div class="content-msg" style="width: 372px;">
								<p style="height: 20px; line-height: 20px; margin-bottom: 2px">1、前往<a target="_blank"
								                                                                      href="https://work.weixin.qq.com/wework_admin/loginpage_wx?from=myhome_baidu">
									企业微信后台</a>创建自建应用。
									<!-- <a target="_blank"
								                        href="https://support.qq.com/products/104790/faqs/63937">
									教程</a> -->
									</p>
								<p style="line-height: 20px;height: 20px;margin-bottom: 0px;">
									2、选择此应用，请确认已设置过应用的可信域名。
									<a :href="$store.state.commonUrl+'/upload/slider.png'" target="_blank"
									   class="el-link el-link--primary">
										<span class="el-link--inner">查看图示</span>
									</a>
								</p>
							</div>
						</template>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>活动名称
						</template>
						<a-input v-model="title" placeholder="请填写活动名称，限20字符"
						         :maxLength="20"
						         style="width: 375px" :disabled="currentStatus == 1"></a-input>
						<span style="display: inline-block; width: 200px; margin-left: 10px;color: #F56C6C">{{title.length}} / 20（一旦发布，不可修改）</span>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>活动时间
						</template>
						<a-date-picker
								:disabled="currentStatus == 1"
								:disabledDate="disabledDate"
								v-model='startValue'
								@change="changeStartTime"
								:showTime="{
											        hideDisabledOptions: true,
											        defaultValue: moment('00:00', 'HH:mm'),
											        format:'HH:mm'
											   }"
								format="YYYY-MM-DD HH:mm"
						/>
						~
						<a-date-picker
								:disabledDate="disabledDate"
								v-model='endValue'
								@change="changeEndTime"
								:showTime="{
											        hideDisabledOptions: true,
											        defaultValue: moment('23:59', 'HH:mm'),
											        format:'HH:mm'
											   }"
								format="YYYY-MM-DD HH:mm"
						/>
						<span style="display: inline-block; width: 210px; margin-left: 10px;color: #F56C6C">（一旦发布，只可更改结束时间）</span>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							活动说明
						</template>
						<div>
							<a-textarea
									v-model="description"
									placeholder="请输入活动时间、活动说明、活动规则、客服电话等告知参与者的信息"
									:autoSize="{ minRows: 5, maxRows: 7 }" style="width: 375px;" :maxLength="100"
							/>
						</div>
						<div style="max-width: 375px; text-align: right">
							<span>{{description.length}}</span>/100
						</div>
					</a-form-item>
					<!--					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
					<!--						<template slot="label">-->
					<!--							<span style="color: red;">*</span>活动样式-->
					<!--						</template>-->
					<!--						<a-radio-group @change="changeStyle" v-model="style">-->
					<!--							<a-radio :value="1">梦幻紫</a-radio>-->
					<!--							<a-radio :value="2">喜庆红</a-radio>-->
					<!--						</a-radio-group>-->
					<!--					</a-form-item>-->
					<!--					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">-->
					<!--						<template slot="label">-->
					<!--							<span style="color: red;">*</span>活动海报-->
					<!--						</template>-->
					<!--						<a-upload-->
					<!--								name="avatar"-->
					<!--								listType="picture-card"-->
					<!--								class="avatar-uploader"-->
					<!--								:showUploadList="false"-->
					<!--								action="https://www.mocky.io/v2/5cc8019d300000980a055e76"-->
					<!--								:beforeUpload="beforeUpload"-->
					<!--								style="width: 440px;"-->
					<!--						>-->
					<!--							<img :src="commonUrl + poster_path" alt="avatar" style="max-width: 100%;max-height:216px;"/>-->
					<!--						</a-upload>-->
					<!--					</a-form-item>-->
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>分享标题
						</template>
						<a-input v-model="share_title" placeholder="玩游戏赢大奖,快快参与,精美奖品等你来拿哦!"
						         style="width: 375px;" :maxLength="30">
							<span slot="suffix"><span>{{share_title.length}}</span>/30</span>
						</a-input>
					</a-form-item>
				</div>
				<div v-show="current == 1" style="margin: 20px;">
					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">初始次数</span>
					<a-divider/>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>初始次数
						</template>
						<a-input-number :min="1" :max="99999999" v-model="init_num" :disabled="currentStatus == 1"/>
						次
					</a-form-item>
					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">参与设置</span>
					<a-divider/>
					<a-form-item class="current0" :label-col="{ width:'100px' }" :wrapper-col="{ width:'300px' }">
						<template slot="label">
							<span style="color: red;">*</span>总参与次数
						</template>
						<a-radio-group v-model="apply_setting[0].limit" buttonStyle="solid">
							<a-radio-button value="0" style="width: 70px;text-align: center;border-radius: 4px;"
							                :disabled="currentStatus == 1">不限
							</a-radio-button>
							<a-radio-button value="1" style="width: 70px;text-align: center;border-radius: 4px;"
							                :disabled="currentStatus == 1">限制
							</a-radio-button>
							<template v-if="apply_setting[0].limit == '1'">
								<a-input-number :min="1" :max="99999999" v-model="apply_setting[0].total_num"
								                :disabled="currentStatus == 1" style="width:80px;margin-left: 5px;"/>
								次
							</template>
						</a-radio-group>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>日参与次数
						</template>
						每人每日参与
						<a-input-number :min="1" :max="99999999" v-model="apply_setting[1].day_num"
						                :disabled="currentStatus == 1" style="width:80px;margin-left: 5px;"/>
						次
					</a-form-item>

					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">中奖设置</span>
					<div style="color: red;display: inline-block;width: calc(100% - 90px);vertical-align: text-top;">
						（当奖品中奖率设置100%，请将中奖次数设置为“不限制”，否则在抽奖页面，会出现因缺少“谢谢参与”转盘字样，而导致有奖品但抽不到。）
					</div>
					<a-divider/>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>总中奖次数
						</template>
						<a-radio-group v-model="award_setting[0].limit" buttonStyle="solid">
							<a-radio-button value="0" style="width: 70px;text-align: center;border-radius: 4px;"
							                :disabled="currentStatus == 1">不限
							</a-radio-button>
							<a-radio-button value="1" style="width: 70px;text-align: center;border-radius: 4px;"
							                :disabled="currentStatus == 1">限制
							</a-radio-button>
							<template v-if="award_setting[0].limit == '1'">
								<a-input-number :min="1" :max="99999999" v-model="award_setting[0].total_num"
								                :disabled="currentStatus == 1" style="width:80px;margin-left: 5px;"/>
								次
							</template>
						</a-radio-group>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>日中奖次数
						</template>
						<a-radio-group v-model="award_setting[1].limit" buttonStyle="solid">
							<a-radio-button value="0" style="width: 70px;text-align: center;border-radius: 4px;"
							                :disabled="currentStatus == 1">不限
							</a-radio-button>
							<a-radio-button value="1" style="width: 70px;text-align: center;border-radius: 4px;"
							                :disabled="currentStatus == 1">限制
							</a-radio-button>
							<template v-if="award_setting[1].limit == '1'">
								<a-input-number :min="1" :max="99999999" v-model="award_setting[1].day_num"
								                :disabled="currentStatus == 1" style="width:80px;margin-left: 5px;"/>
								次
							</template>
						</a-radio-group>
					</a-form-item>

					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">分享设置</span>
					<a-divider/>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>是否需要分享
						</template>
						<a-switch v-model="isNeedShare" :disabled="currentStatus == 1" />
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" v-if="isNeedShare">
						<template slot="label">
							<span style="color: red;">*</span>分享1次增加次数
						</template>
						<a-input-number :min="1" :max="99999999" v-model="share_setting[0].total_num"
						                :disabled="currentStatus == 1" style="width:80px;margin-left: 5px;"/>
						次
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" v-if="isNeedShare">
						<template slot="label">
							<span style="color: red;">*</span>日分享获得最大次数
						</template>
						<a-radio-group v-model="share_setting[1].limit" buttonStyle="solid">
							<a-radio-button value="0" style="width: 70px;text-align: center;border-radius: 4px;"
							                :disabled="currentStatus == 1">不限
							</a-radio-button>
							<a-radio-button value="1" style="width: 70px;text-align: center;border-radius: 4px;"
							                :disabled="currentStatus == 1">限制
							</a-radio-button>
							<template v-if="share_setting[1].limit == '1'">
								<a-input-number :min="1" :max="99999999" v-model="share_setting[1].day_num"
								                :disabled="currentStatus == 1" style="width:80px;margin-left: 5px;"/>
								次
							</template>
						</a-radio-group>
					</a-form-item>
				</div>
				<div v-show="current == 2" style="margin: 20px;">
					<div style="color: red;margin: 20px;">
						<p>温馨提示: 1.单个奖项中奖率范围:0-100%</p>
						<p>2.多奖项相加，总中奖率不能超过100%</p>
						<p>3.活动开始后，奖品不可修改</p>
					</div>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>奖品处理
						</template>
						<a-radio-group name="radioGroup" :value="prize_send_type"
						               @change="changePrizeSendType"
						               :disabled="currentStatus == 1">
							<a-radio :value="1">活动期间</a-radio>
							<a-radio :value="2">活动结束</a-radio>
						</a-radio-group>
						<span style="color: #F56C6C;">（一旦发布，不可修改。）</span>
					</a-form-item>
					<a-tabs hideAdd v-model="activeKey" type="editable-card" @edit="onEdit">
						<template v-for="(pane,index) in panes">
							<a-tab-pane :tab="pane.title+(index+1)" :key="pane.key"
							            :closable="currentStatus == 1 ? false : true">
								<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
									<template slot="label">
										<span style="color: red;">*</span>奖品类型
									</template>
									<a-radio-group name="radioGroup" :value="pane.prize_type"
									               @change="e=>changePrizeType(e,pane.key)"
									               :disabled="currentStatus == 1">
										<a-radio :value="0">实物</a-radio>
										<a-radio :value="1">红包</a-radio>
									</a-radio-group>
									<span style="color: #F56C6C;">（一旦发布，不可修改。）</span>
								</a-form-item>
								<template v-if="pane.prize_type == 0">
									<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<template slot="label">
											<span style="color: red;">*</span>奖品名称
										</template>
										<a-input v-model="pane.name" placeholder="奖品名称"
										         style="width: 375px" :disabled="currentStatus == 1" :maxLength="20">
											<span slot="suffix"><span>{{pane.name.length}}</span>/20</span>
										</a-input>
									</a-form-item>
									<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<template slot="label">
											<span style="color: red;">*</span>奖品数量
										</template>
										<a-input-number :min="1" :max="99999999" v-model="pane.num"
										                :disabled="currentStatus == 1" style="width:375px;"/>
									</a-form-item>
									<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<template slot="label">
											<span style="color: red;">*</span>中奖率
										</template>
										<a-input-number :min="0" :max="100" :step="0.01" :precision="2"
										                v-model="pane.percentage" placeholder="中奖率" style="width: 375px"
										                :disabled="currentStatus == 1"/>
										%
									</a-form-item>
									<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<template slot="label">
											<span style="color: red;">*</span>奖品图片
										</template>
										<a-upload
												name="avatar"
												listType="picture-card"
												class="avatar-uploader logo-style"
												:showUploadList="false"
												action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
												:beforeUpload="beforeUpload" :disabled="currentStatus == 1"
										>
											<img v-if="pane.logo != ''" :src="commonUrl + pane.logo" alt="avatar"
											     style="max-width: 48px;height: 48px;"/>
											<div v-else>
												<a-icon :type="loading ? 'loading' : 'plus'"/>
											</div>
										</a-upload>
										<div style="color: #999;font-size: 13px;line-height: 13px;float: left;
    margin-top: 50px;">（建议尺寸 48*48）
										</div>
									</a-form-item>
									<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<template slot="label">
											<span style="color: red;">*</span>奖品说明
										</template>
										<div>
											<a-textarea
													v-model="pane.description"
													placeholder="请输入活动时间、活动说明、参与规则、客服电话等告知参与者的信息"
													:autoSize="{ minRows: 3, maxRows: 5 }"
													style="width: 375px;" :disabled="currentStatus == 1"
													:maxLength="100"
											/>
										</div>
										<div style="max-width: 375px; text-align: right">
											<span>{{pane.description.length}}</span>/100
										</div>
									</a-form-item>
								</template>
								<template v-if="pane.prize_type == 1">
									<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<template slot="label">
											<span style="color: red;">*</span>红包金额
										</template>
										<a-input-number :step="0" :precision="2" style="width: 140px;margin-right: 5px;"
										                :min="0.30" :max="5000.00"
										                v-model="pane.amount" :disabled="currentStatus == 1"/>
										元
										<span style="color: #F56C6C;">（一旦发布，不可修改。精确到小数点后两位，可输入0.30~5000.00）</span>
									</a-form-item>
									<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<template slot="label">
											<span style="color: red;">*</span>红包数量
										</template>
										<a-input-number :min="1" :max="99999999" v-model="pane.num"
										                :disabled="currentStatus == 1" style="width:375px;"/>
									</a-form-item>
									<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
										<template slot="label">
											<span style="color: red;">*</span>中奖率
										</template>
										<a-input-number :min="0" :max="100" :step="0.01" :precision="2"
										                v-model="pane.percentage" placeholder="中奖率" style="width: 375px"
										                :disabled="currentStatus == 1"/>
										%
									</a-form-item>
								</template>
							</a-tab-pane>
						</template>
						<a-button slot="tabBarExtraContent" @click="add"
						          :disabled="currentStatus == 1 ||panes.length >= 6 ">新增奖项
						</a-button>
					</a-tabs>
				</div>
				<div v-show="current == 3" style="margin: 20px;">
					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">参与限制</span>
					<a-divider/>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>性别参与
						</template>
						<a-radio-group name="radioGroup" :value="sexType" @change="changeSexType"
						               :disabled="currentStatus == 1">
							<a-radio :value="1">不限制</a-radio>
							<a-radio :value="2">仅男性参与</a-radio>
							<a-radio :value="3">仅女性参与</a-radio>
							<a-radio :value="4">未知</a-radio>
						</a-radio-group>
						<div style="color: #F56C6C;">（一旦发布，不可修改。以在本系统的性别数据为准）</div>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<span slot="label">
							<span style="color: red;">*</span>地区参与
							<a-tooltip title="根据用户基本信息接口判断客户所在地区。由于客户可手动修改地理位置，因此不能完全保证客户位置的准确性">
								<a-icon type="question-circle"/>
							</a-tooltip>
						</span>
						<a-radio-group name="radioGroup" :value="areaType" @change="changeAreaType"
						               :disabled="currentStatus == 1">
							<a-radio :value="1">不限制</a-radio>
							<a-radio :value="2">部分地区参与
							</a-radio>
						</a-radio-group>
						<span style="color: #F56C6C;">（一旦发布，可参与的地区只可增加）</span>
						<template v-if="areaType == 2">
							<div v-for="(item,index) in province" :key="index">
								<a-cascader change-on-select
								            :options="cityData"
								            @change="e => changeArea(e,index)"
								            placeholder="请选择地区"
								            style="width: 374px;text-align: left;"
								            :value="item"
								            :disabled="item.disabled"
								/>
								<span v-if="index == province.length - 1"
								      style="color: #01b065;margin-left: 10px;cursor: pointer;"
								      @click="addArea">添加</span>
								<span v-if="!item.disabled && province.length > 1"
								      style="color: #01b065;margin-left: 10px;cursor: pointer;"
								      @click="delArea(index)">删除</span>
							</div>
						</template>
					</a-form-item>
					<span style="border-left: 4px solid #01b065;padding-left: 10px;margin-left: 10px;">客户标签<span
							style="color: #F56C6C;">（不论邀请人，还是助力者，只要参与该场活动，则自动打上选中的客户标签）</span></span>
					<a-divider/>
					<div class="current0 ant-col-20 corp-choose-tag" style="width: 100%;">
						<corpChooseTag :callback="modalVisibleChange4" :hasChoose="tag_arr"
						               v-if="isShowTag"></corpChooseTag>
					</div>
				</div>
				<div v-show="current == 4" style="margin: 20px;">
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
						<template slot="label">
							海报图片
						</template>
						<a-upload
								action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
								:showUploadList="false"
								:beforeUpload="beforeUpload"
						>
							<div v-if="!back_pic_url">
								<a-button>
									<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
									上传海报
								</a-button>
							</div>
							<img v-if="back_pic_url" style="max-width: 128px; max-height: 128px;"
							     :src="commonUrl + back_pic_url"/>
							<div style="display: inline-block;vertical-align: bottom;margin-left: 5px;"
							     v-if="back_pic_url">
								<a-button>
									<a-icon :type="loading ? 'loading' : 'upload'"></a-icon>
									重新上传
								</a-button>
							</div>
							<div style="margin-top: 10px;">
								图片像素建议为1080px*1920px，格式为jpg、bmp、png，大小不超过2M
							</div>
						</a-upload>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
						<template slot="label">
							头像
						</template>
						<a-switch :checked="is_avatar" @click="changeAdatar"/>
						<div style="display: inline-block;" v-if="is_avatar">
							<a-button @click="changeShape('circle')"
							          :class="shape== 'circle' ? 'shape-active' : '' "
							          style="margin-left: 40px;display: inline-block;"
							>
								圆型
							</a-button>
							<a-button @click="changeShape('square')"
							          :class="shape== 'square' ? 'shape-active' : '' "
							          style="margin-left: 10px;display: inline-block;"
							>
								方形
							</a-button>
						</div>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
						<template slot="label">
							昵称
						</template>
						<div style="display: inline-block; vertical-align: top;">
							<a-switch :checked="is_nickname" @click="changeNickName"/>
						</div>
						<div style="display: inline-block;margin-left: 40px" v-if="is_nickname">
							<div>颜色
								<template>
									<a-popover
											trigger="click"
											placement="right"
									>
										<color-picker slot="content" v-model="color"></color-picker>
										<div style="display: inline-block;" class="color-box">
												<span class="color-show"
												      :style="{'background-color': fcRemark()}"></span>
										</div>
									</a-popover>
								</template>
							</div>
						</div>
						<div style="display: inline-block;margin-left: 40px" v-if="is_nickname">
							<div style="text-align: center">大小
								<a-select
										showSearch
										style="width: 70px;margin-bottom: 20px;"
										@change="changeNickNameFontSize"
										v-model="font_size"
								>
									<a-select-option value="12">12</a-select-option>
									<a-select-option value="14">14</a-select-option>
									<a-select-option value="16">16</a-select-option>
									<a-select-option value="18">18</a-select-option>
									<a-select-option value="20">20</a-select-option>
									<a-select-option value="22">22</a-select-option>
									<a-select-option value="24">24</a-select-option>
								</a-select>
							</div>
						</div>
						<div style="display: inline-block;vertical-align: top; margin-left: 40px"
						     v-if="is_nickname">
							<a-button @click="changeAlign('left')"
							          :class="align== 'left' ? 'shape-active' : '' "
							          style="margin-left: 10px;display: inline-block;"
							>
								左对齐
							</a-button>
							<a-button @click="changeAlign('center')"
							          :class="align== 'center' ? 'shape-active' : '' "
							          style="margin-left: 10px;display: inline-block;"
							>
								居中
							</a-button>
							<a-button @click="changeAlign('right')"
							          :class="align== 'right' ? 'shape-active' : '' "
							          style="margin-left: 10px;display: inline-block;"
							>
								右对齐
							</a-button>
						</div>
					</a-form-item>
				</div>
				<div v-show="current == 5" style="margin: 20px;">
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
						<template slot="label">
							引流设置
						</template>
						海报二维码自带对应参数，扫码后会将客户引流至对应的企业成员
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
						<template slot="label"><span
								style="color: red">*</span>引流成员
						</template>
						<a-button style="margin-left: 10px;" @click="showDepartmentList">
							选择
						</a-button>
						<span style="margin-left: 5px"
						      v-show="chooseNum > 0">已选择{{chooseUserNum}}名成员，{{chooseDepartmentNum}}个部门</span>
						<a style="margin-left: 10px;" v-show="chooseNum > 0"
						   @click="clearDepartmentList">
							重置
						</a>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
						<template slot="label">
							设置欢迎语
						</template>
						<div>客户通过海报添加对应微信后，可自动发送设置的内容<span style="color: #F56C6C"></span></div>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
						<template slot="label">
							文本
						</template>
						<editor v-if="editorFlag" :text="textContent"
						        :textValue="textAreaValueHeader"
						        :isEmoji="false"
						        @changeText="changeText">
						</editor>
					</a-form-item>
					<a-form-item class="current0" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<template slot="label">
							<span style="color: red;">*</span>图片封面
						</template>
						<a-upload
								name="avatar"
								listType="picture-card"
								class="avatar-uploader link_pic_url_style"
								:showUploadList="false"
								action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
								:beforeUpload="beforeUpload"
						>
							<img v-if="link_pic_url != ''" :src="commonUrl + link_pic_url" alt="avatar"
							     style="max-width: 78px;height: 78px;"/>
							<div v-else>
								<a-icon :type="loading ? 'loading' : 'plus'" style="font-size:32px;"/>
							</div>
						</a-upload>
						<div style="color: #999;font-size: 13px;line-height: 13px;margin-top: 83px;float: left;">
							（图片大小不超过2M，支持JPG、JPEG及PNG格式）
						</div>
					</a-form-item>
					<!-- 填写标题 -->
					<a-form-item class="current0" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
						<template slot="label"><span
								style="color: red">*</span>填写标题
						</template>
						<a-input v-model="link_start_title" style="max-width: 500px;"
						         :maxLength="32">
							<span slot="suffix"><span>{{link_start_title.length}}</span>/32</span>
						</a-input>
					</a-form-item>
					<!-- 添加描述 -->
					<a-form-item class="current0" style="margin-top: 10px;" :label-col="{ span: 3 }"
					             :wrapper-col="{ span: 21 }">
						<template slot="label">
							添加描述
						</template>
						<div>
							<a-textarea style="max-width: 500px;" placeholder="填写图文描述" v-model="link_desc"
							            :maxLength="128" :rows="4"/>
						</div>
						<div style="max-width: 500px; text-align: right">
							<span>{{link_desc.length}}</span>/128
						</div>
					</a-form-item>
				</div>
			</div>
			<div class="steps-action">
				<a-button v-if="current>0" @click="prev">
					上一步
				</a-button>
				<a-button v-if="current < steps.length - 1" style="margin-left: 8px;" type="primary" @click="next">
					下一步
				</a-button>
				<a-button style="margin-left: 8px"
				          :loading="createLoading"
				          v-if="current == steps.length - 1"
				          type="primary"
				          @click="createActivity"
				>
					提交
				</a-button>
			</div>
		</div>
		<!-- 企业微信选择弹窗 -->
		<WeChatModal :show="showModal2" :callback="modalVisibleChange" hasName="raffle-add"></WeChatModal>
		<!-- 选择部门成员弹窗 -->
		<chooseDepartment ref="user" :show="showModalDepartment" :chooseNum="chooseNum" :is_from="7"
		                  :callback="modalVisibleChange3"></chooseDepartment>
	</div>
</template>

<script>
	import img1 from '../../../assets/mobileLeft.jpg'
	import img2 from '../../../assets/mobileLeft2.png'
	import img3 from '../../../assets/poster-img.png'
	import img4 from '../../../assets/poster-img2.png'
	import WeChatModal from "@/components/WeChatModal.vue"
	import chooseDepartment from "@/components/ChooseDepartment.vue"
	import moment from 'moment';
	import VueDraggableResizable from 'vue-draggable-resizable'
	import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
	import {Sketch} from "vue-color";
	import editor from '../../../components/editor/index'
	import cityData from "../../../common/js/TencentAddress.js";
	import corpChooseTag from "@/components/corpChooseTag/CorpChooseTag.vue"

	export default {
		name      : "add",
		components: {
			WeChatModal, chooseDepartment,
			"vue-draggable-resizable": VueDraggableResizable,
			"color-picker"           : Sketch,
			editor, corpChooseTag
		},
		data () {
			return {
				editorFlag         : false,
				wordNum            : 0,
				wordLimit          : 1000,
				textAreaValueHeader: '',
				textContent        : '',
				mediumEditor       : '',
				options            : {
					toolbar      : false,
					placeholder  : {
						text: ""
					},
					anchorPreview: false,
					paste        : {
						forcePlainText : true,
						cleanPastedHTML: true,
						cleanAttrs     : ['class', 'style', 'dir', 'align', 'width', 'height', 'face', 'title', 'code', 'name', 'id', 'type', 'span', 'border', 'open', 'action', 'method', 'cols', 'for', 'rel', 'label', 'icon', 'value', 'max', 'min', 'classid']
					}
				},
				current            : 0, // 步骤index
				commonUrl          : this.$store.state.commonUrl,
				steps              : [  // 步骤名
					{
						title: '活动设置',
					},
					{
						title: '规则设置',
					},
					{
						title: '奖项设置',
					},
					{
						title: '高级设置',
					},
					{
						title: '海报设置',
					},
					{
						title: '欢迎语设置',
					}
				],
				mobileImg          : img1,//左侧可视化图片
				showModal2         : false,// 企业微信弹窗
				corpName           : localStorage.getItem("corpName"),
				corpId             : localStorage.getItem("corpId"),
				// 应用id
				agent_id           : [],
				agentList          : [], // 应用列表
				//活动名称
				title              : '',
				//活动时间
				startValue         : null,
				endValue           : null,
				start_time         : '',
				end_time           : '',
				endOpen            : false,
				//活动说明
				description        : '',
				//活动样式
				style              : 1,
				//活动海报
				poster_path        : img3,
				//分享标题
				share_title        : '玩游戏赢大奖,快快参与,精美奖品等你来拿哦!',
				//初始次数
				init_num           : 1,
				//参与设置
				apply_setting      : [
					{
						limit    : '1',//0不限制，1限制
						total_num: 1,//总中奖次数
					}, {
						day_num: 1,//单日中奖次数
					}
				],
				//中奖设置
				award_setting      : [
					{
						limit    : '1',//0不限制，1限制
						total_num: 1,//总中奖次数
					}, {
						limit  : '1',//0不限制，1限制
						day_num: 1,//单日中奖次数
					}
				],
				//分享设置
				share_setting      : [
					{
						total_num: 1,//总中奖次数
					}, {
						limit  : '1',//0不限制，1限制
						day_num: 1,//单日中奖次数
					}
				],
				isNeedShare        : true,//是否需要分享
				//奖项设置
				activeKey          : 1,
				panes              : [
					{
						id         : 0,
						title      : '奖项',
						key        : 1,
						name       : '精美礼品一份',
						num        : '',
						percentage : '',
						logo       : '',
						description: '',
						inputMaxL  : 0,
						//奖品类型
						prize_type : 0,//0实物，1红包
						amount     : 1,//红包金额
					},
					{
						id         : 0,
						title      : '奖项',
						key        : 2,
						name       : '精美礼品一份',
						num        : '',
						percentage : '',
						logo       : '',
						description: '',
						inputMaxL  : 0,
						//奖品类型
						prize_type : 0,//0实物，1红包
						amount     : 1,//红包金额
					},
					{
						id         : 0,
						title      : '奖项',
						key        : 3,
						name       : '精美礼品一份',
						num        : '',
						percentage : '',
						logo       : '',
						description: '',
						inputMaxL  : 0,
						//奖品类型
						prize_type : 0,//0实物，1红包
						amount     : 1,//红包金额
					},
				],
				//海报设置
				loading            : false, // 上传图片的loading
				back_pic_url       : '/static/image/raffle/raffle.png',//海报背景图
				is_avatar          : true, // 头像选择按钮
				avatar             : {
					w: 39,
					x: 18,
					y: 270
				}, // 头像大小位置
				nickName           : {
					w: 84,
					h: 28,
					x: 65,
					y: 267
				}, // 昵称大小位置
				qrCode             : {
					w: 60,
					x: 183,
					y: 265
				}, // 二维码大小位置
				shape              : "circle", // circle圆形 square方形
				is_nickname        : true, // 昵称选择按钮
				color              : '#BFBFBF', // 颜色
				font_size          : 12, // 大小
				align              : 'left', // 对齐方式
				backHeight         : 330, // 海报图片区域高度
				menuKey            : 1, // 改变海报图片时强制渲染页面


				//欢迎语设置
				chooseNum          : 0, // 部门成员总个数
				chooseUserNum      : 0,//成员个数
				chooseDepartmentNum: 0,//部门个数
				showModalDepartment: false, // 选择成员弹窗
				user               : [],//选择成员数组
				text_content       : '',//文本
				link_pic_url       : '',//图片封面
				link_start_title   : '',//标题
				link_desc          : '',//描述
				createLoading      : false, // 活动创建按钮loading
				id                 : '',//修改时的id
				currentStatus      : '',//修改时发布状态，1发布中


				//高级设置
				sexType        : 1,//性别参与
				areaType       : 1,//地区参与
				// 地域
				cityData,
				province       : [
					[]
				],
				tag_arr        : [], //标签值
				isShowTag      : false,
				//奖品处理
				prize_send_type: 1,//1活动期间，2活动结束
				raffleNum      : Number(this.$store.state.packageDetail.raffleNum),//抽奖引流人数上限数
			}
		},
		methods   : {
			goBack () {
				localStorage.removeItem('notAllow')
				localStorage.removeItem('backUrl')
				this.$router.push("/raffle/list?isRefresh=1")
			},
			onChange () {
			},
			//欢迎语设置
			// 重置
			clearDepartmentList () {
				this.user = []
				this.chooseNum = 0
				this.chooseUserNum = 0
				this.chooseDepartmentNum = 0
				this.$refs.user.rightIdList = []
				this.$refs.user.rightList = []
			},
			// 选择成员
			showDepartmentList () {
				let arr = []
				this.user.map(x => {
					arr.push(x.id)
				})
				this.$refs.user.rightIdList = JSON.parse(JSON.stringify(arr))
				this.$refs.user.rightList = JSON.parse(JSON.stringify(this.user))
				this.showModalDepartment = true
			},

			// 选择成员回调
			modalVisibleChange3 (event, arr, userNum, departmentNum, list) {
				if (event == "ok") {
					this.chooseNum = parseInt(userNum) + parseInt(departmentNum)
					this.chooseUserNum = userNum
					this.chooseDepartmentNum = departmentNum
					if (this.chooseNum > 0) {
						this.user = JSON.parse(JSON.stringify(list))
					} else {
						this.user = []
					}
				}
				this.showModalDepartment = false
			},


			changeCurrent (index) {
				this.current = index
			},
			// 改变企业微信
			changeCorp () {
				if (this.id) {
					return
				}
				this.showModal2 = true
			},
			modalVisibleChange (type, corpId, corpName) {
				if (type == 'ok') {
					this.corpName = corpName
					this.corpId = corpId
					this.$refs.user.staffList = []
					this.$refs.user.keyList = []
				}
				this.showModal2 = false
			},
			//获取应用列表
			async getAgentList (id) {
				const {data: res} = await this.axios.post("work-group-sending/agent-list", {
					corp_id   : this.corpId,
					suite_id  : 1,
					agent_type: 2
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.agentList = res.data
					if (id) {
						this.agent_id = id
					} else {
						if (this.agentList.length > 0) {
							this.agent_id = this.agentList[0].id
						}
					}
					this.isShowTag = true
				}
			},
			//活动时间
			moment,
			disabledDate (current) {
				// Can not select days before today and today
				return current && current < moment().startOf('day');
			},
			changeStartTime (date, dateString) {
				if (dateString && this.startDate && dateString > moment(this.endDate).format("YYYY-MM-DD HH:mm:ss")) {
					this.$message.warning('开始时间不能晚于结束时间')
				}
				if (dateString) {
					this.startValue = date
				} else {
					this.startValue = null
				}
				this.start_time = dateString
			},
			changeEndTime (date, dateString) {
				if (dateString && this.startDate && dateString < moment(this.startDate).format("YYYY-MM-DD HH:mm:ss")) {
					this.$message.warning('结束时间不能早于开始时间')
				}
				if (dateString) {
					this.endValue = date
				} else {
					this.endValue = null
				}
				this.end_time = dateString
			},
			//活动样式
			changeStyle () {
				if (this.style == 1) {
					this.mobileImg = img1
					this.poster_path = img3
				} else if (this.style == 2) {
					this.mobileImg = img2
					this.poster_path = img4
				}
			},
			//活动海报
			beforeUpload (file) {
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJpgOrPng) {
					this.$message.error('海报仅支持jpg、jpeg、png格式！');
					return false
				}
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('图片大小不超过2M');
					return false
				}
				if (this.current == 2) {
					this.uploadImage(file, 2, this.activeKey)
				} else if (this.current == 4) {
					this.uploadImage(file, 4)
				} else if (this.current == 5) {
					this.uploadImage(file, 5)
				}
			},
			// 上传
			async uploadImage (file, type, activeKey) {
				this.loading = true
				let param = new FormData();
				param.append("uid", localStorage.getItem('uid'));
				param.append("fileInfo", file);
				const {data: res} = await this.axios.post("sub-user/upload-image", param);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.loading = false
				} else {
					if (type == 0) {
						this.poster_path = res.data.local_path
					} else if (type == 2) {
						this.panes.map(x => {
							if (activeKey == x.key) {
								x.logo = res.data.local_path
							}
						})
					} else if (type == 4) {
						this.back_pic_url = res.data.local_path
						this.posterBackHeight()
					} else if (type == 5) {
						this.link_pic_url = res.data.local_path
					}
					this.loading = false
				}
			},
			posterBackHeight () {
				let that = this
				let img = new Image()
				img.src = this.commonUrl + this.back_pic_url
				img.onload = function () {
					that.backHeight = img.height / (img.width / 250) < 330 ? 330 : img.height / (img.width / 250)
					if (that.avatar.y > that.backHeight) {
						that.avatar.y = that.backHeight - that.avatar.w
					}
					if (that.nickName.y > that.backHeight) {
						that.nickName.y = that.backHeight - that.nickName.h
					}
					if (that.qrCode.y > that.backHeight) {
						that.qrCode.y = that.backHeight - that.qrCode.w
					}
					++that.menuKey
				}
			},
			//海报设置
			// 头像是否显示
			changeAdatar (value) {
				this.is_avatar = value
			},
			// 头像形状
			changeShape (type) {
				this.shape = type
			},
			// 昵称是否显示
			changeNickName (value) {
				this.is_nickname = value
			},
			// 样式
			fcRemark () {
				if (typeof this.color.hex != "undefined") {
					this.color = this.color.hex
				}
				return this.color;
			},
			// 昵称文字大小
			changeNickNameFontSize (font_size) {
				this.font_size = font_size
			},
			// 昵称文字格式
			changeAlign (align) {
				this.align = align
			},
			// 头像大小
			onResizeAvatar: function (x, y, w, h) {
				this.avatar.x = x
				this.avatar.y = y
				if (w > h) {
					h = w
				} else {
					w = h
				}
				this.avatar.w = parseInt(w)
			},
			// 移动头像
			onDragAvatar  : function (x, y) {
				this.avatar.x = x
				this.avatar.y = y
			},
			// 移动昵称
			onDragNickName (x, y) {
				this.nickName.x = x
				this.nickName.y = y
			},
			// 昵称宽度
			nickNameWidth () {
				this.nickName.w = parseInt(this.font_size) * 6
				return parseInt(this.font_size) * 6
			},
			// 昵称高度
			nickNameHeight () {
				return parseInt(this.font_size) * 2
			},
			// 昵称样式
			nickNameStyle () {
				let style = {
					fontSize  : this.font_size + 'px',
					color     : this.color,
					lineHeight: (parseInt(this.font_size) * 2 - 4) + 'px'
				}
				if (this.align) {
					style['textAlign'] = this.align
				}
				return style
			},
			// 移动二维码
			onDragQrcode (x, y) {
				this.qrCode.x = x
				this.qrCode.y = y
			},
			// 二维码大小
			onResizeQrcode (x, y, w, h) {
				this.qrCode.x = x
				this.qrCode.y = y
				if (w > h) {
					h = w
				} else {
					w = h
				}
				this.qrCode.w = parseInt(w)
			},


			//奖项设置
			onEdit (targetKey, action) {
				this[action](targetKey);
				// console.log(targetKey, action)
			},
			add () {
				if (this.panes.length >= 6) {
					this.$message.warning("最多设置6个奖品")
				} else {
					const panes = this.panes;
					let newTabIndex = Number(this.panes[this.panes.length - 1].key)
					const activeKey = ++newTabIndex;
					panes.push({
						id         : 0,
						title      : '奖项',
						key        : activeKey,
						name       : '精美礼品一份',
						num        : '',
						percentage : '',
						logo       : '',
						description: '',
						inputMaxL  : '',
						//奖品类型
						prize_type : 0,//0实物，1红包
						amount     : 1,//红包金额
					});
					this.panes = panes;
					this.activeKey = activeKey;
				}
			},
			remove (targetKey) {
				if (this.panes.length > 1) {
					let activeKey = this.activeKey;
					let lastIndex;
					this.panes.forEach((pane, i) => {
						if (pane.key === targetKey) {
							lastIndex = i - 1;
						}
					});
					const panes = this.panes.filter(pane => pane.key !== targetKey);
					if (panes.length && activeKey === targetKey) {
						if (lastIndex >= 0) {
							activeKey = panes[lastIndex].key;
						} else {
							activeKey = panes[0].key;
						}
					}
					this.panes = panes;
					this.activeKey = activeKey;
				} else {
					this.$message.warning("奖品必须要有")
					return false
				}
			},

			//修改奖品发放类型
			changePrizeSendType (e) {
				this.prize_send_type = e.target.value
			},
			//修改奖品类型
			changePrizeType (e, key) {
				this.panes.map(x => {
					if (x.key == key) {
						x.prize_type = e.target.value
					}
				})
			},
			//修改性别参与类型
			changeSexType (e) {
				this.sexType = e.target.value
			},
			//修改地区参与类型
			changeAreaType (e) {
				this.areaType = e.target.value
				this.province = [
					[]
				]
			},
			// 地域
			changeArea (value, index) {
				this.$set(this.province, index, value)
				this.$forceUpdate()
				// this.province[index] = value
			},
			addArea () {
				let arr = []
				this.province.push(arr)
			},
			delArea (index) {
				this.province.splice(index, 1)
			},
			//客户标签
			modalVisibleChange4 (event, str) {
				if (event == "ok") {
					this.tag_arr = str.split(',')
				}
			},

			// 下一步
			next () {
				if (this.checkout(this.current)) {
					this.current++;
				}
			},
			checkout (current) {
				if (current == 0) {
					if (typeof this.agent_id == 'object' && this.agent_id.length == 0) {
						this.$message.warning("请选择应用")
						return false
					}
					if (this.title == '') {
						this.$message.warning("请填写活动名称")
						return false
					}
					if (this.startValue == null || this.endValue == null) {
						this.$message.warning("请检查活动时间")
						return false
					}
					if (this.start_time > this.end_time) {
						this.$message.warning("开始时间不能大于结束时间")
						return false
					}
					if (this.end_time < moment(new Date()).format("YYYY-MM-DD HH:mm:ss")) {
						this.$message.warning("结束时间不能早于当前时间")
						return false
					}
					if (this.share_title == '') {
						this.$message.warning("请填写分享标题")
						return false
					}
				}
				var regNum = /^[0-9]+.?[0-9]*$/;
				if (current == 1) {
					//参与设置
					if (this.apply_setting[0].limit == '1') {
						if (!regNum.test(this.apply_setting[0].total_num)) {
							this.$message.warning("请填写数字")
							return false
						} else {
							if (Number(this.apply_setting[0].total_num) < 1 && Number(this.apply_setting[0].total_num) % 1 != 0) {
								this.$message.warning("请填写大于等于1的整数")
								return false
							}
						}
					}
					if (!regNum.test(this.apply_setting[1].day_num)) {
						this.$message.warning("请填写数字")
						return false
					} else {
						if (Number(this.apply_setting[1].day_num) < 1 && Number(this.apply_setting[1].day_num) % 1 != 0) {
							this.$message.warning("请填写大于等于1的整数")
							return false
						}
					}
					if (this.apply_setting[0].limit == '1' && Number(this.apply_setting[1].day_num) > Number(this.apply_setting[0].total_num)) {
						this.$message.warning("日参与次数不能大于总参与次数")
						return false
					}
					//中奖设置
					if (!regNum.test(this.init_num)) {
						this.$message.warning("请填写数字")
						return false
					} else {
						if (Number(this.init_num) < 1 && Number(this.init_num) % 1 != 0) {
							this.$message.warning("请填写大于等于1的整数")
							return false
						}
					}
					if (this.award_setting[0].limit == '1') {
						if (!regNum.test(this.award_setting[0].total_num)) {
							this.$message.warning("请填写数字")
							return false
						} else {
							if (Number(this.award_setting[0].total_num) < 1 && Number(this.award_setting[0].total_num) % 1 != 0) {
								this.$message.warning("请填写大于等于1的整数")
								return false
							}
						}
					}
					if (this.award_setting[1].limit == '1') {
						if (!regNum.test(this.award_setting[1].day_num)) {
							this.$message.warning("请填写数字")
							return false
						} else {
							if (Number(this.award_setting[1].day_num) < 1 && Number(this.award_setting[1].day_num) % 1 != 0) {
								this.$message.warning("请填写大于等于1的整数")
								return false
							}
						}
					}
					if (this.award_setting[0].limit == '1') {
						if (this.award_setting[1].limit == '0') {
							this.$message.warning("日中奖次数不能大于总中奖次数")
							return false
						}
						if (Number(this.award_setting[1].day_num) > Number(this.award_setting[0].total_num)) {
							this.$message.warning("日中奖次数不能大于总中奖次数")
							return false
						}
					}

					//分享设置
					if (!regNum.test(this.share_setting[0].total_num)) {
						this.$message.warning("请填写数字")
						return false
					} else {
						if (Number(this.share_setting[0].total_num) < 1 && Number(this.share_setting[0].total_num) % 1 != 0) {
							this.$message.warning("请填写大于等于1的整数")
							return false
						}
					}
					if (this.share_setting[1].limit == '1') {
						if (!regNum.test(this.share_setting[1].day_num)) {
							this.$message.warning("请填写数字")
							return false
						} else {
							if (Number(this.share_setting[1].day_num) < 1 && Number(this.share_setting[1].day_num) % 1 != 0) {
								this.$message.warning("请填写大于等于1的整数")
								return false
							}
						}
					}
					if(this.isNeedShare){
						if (this.share_setting[1].limit == '1' && Number(this.share_setting[0].total_num) > Number(this.share_setting[1].day_num)) {
							this.$message.warning("分享1次增加次数不能大于日分享最大次数")
							return false
						}
					}
					// if (this.apply_setting[0].limit == '1') {
					// 	let a = Number(this.share_setting[0].total_num) + Number(this.init_num)
					// 	if (a > Number(this.apply_setting[0].total_num)) {
					// 		this.$message.warning("初始次数+分享1次增加的次数不能大于总参数次数")
					// 		return false
					// 	}
					// }
				}
				if (current == 2) {
					for (let i = 0; i < this.panes.length; i++) {
						if (this.panes[i].prize_type == 0) {
							if (this.panes[i].name == '') {
								this.$message.warning("奖品信息必须填写完整才能保存")
								return false
							} else if (this.panes[i].num == '') {
								this.$message.warning("奖品信息必须填写完整才能保存")
								return false
							} else if (!regNum.test(this.panes[i].num)) {
								this.$message.warning("奖品数量请填写数字")
								return false
							} else if (this.panes[i].num <= 0) {
								this.$message.warning("奖品数量必须大于0")
								return false
							} else if (this.panes[i].percentage == '' && this.panes[i].percentage != 0) {
								this.$message.warning("奖品信息必须填写完整才能保存")
								return false
							} else if (Number(this.panes[i].percentage) < 0) {
								this.$message.warning("中奖率必须为正数")
								return false
							} else if (this.panes[i].logo == '') {
								this.$message.warning("奖品信息必须填写完整才能保存")
								return false
							} else if (this.panes[i].description == '') {
								this.$message.warning("奖品信息必须填写完整才能保存")
								return false
							}
						} else if (this.panes[i].prize_type == 1) {
							if (this.panes[i].amount == '' || this.panes[i].amount == null) {
								this.$message.warning("奖品信息必须填写完整才能保存")
								return false
							} else if (this.panes[i].num == '') {
								this.$message.warning("奖品信息必须填写完整才能保存")
								return false
							} else if (!regNum.test(this.panes[i].num)) {
								this.$message.warning("红包数量请填写数字")
								return false
							} else if (this.panes[i].num <= 0) {
								this.$message.warning("红包数量必须大于0")
								return false
							} else if (this.panes[i].percentage == '' && this.panes[i].percentage != 0) {
								this.$message.warning("奖品信息必须填写完整才能保存")
								return false
							} else if (Number(this.panes[i].percentage) < 0) {
								this.$message.warning("中奖率必须为正数")
								return false
							}
						}
					}
					let percentage = 0
					this.panes.map(x => {
						percentage += Number(x.percentage)
					})
					if (percentage > 100) {
						this.$message.warning("所有的中奖率相加必须小于等于100")
						return false
					}
				}
				if (current == 3) {
					if (this.areaType == 2) {
						let isEmpty = true
						for (let i = 0; i < this.province.length; i++) {
							if (this.province[i].length > 0) {
								isEmpty = false
							}
						}
						if (isEmpty) {
							this.$message.warning("请选择地区")
							return false
						}
					}
				}
				return true
			},
			// 上一步
			prev () {
				this.current--;
			},
			//提交
			async createActivity () {
				this.createLoading = true
				if (!this.checkout(0)) {
					this.createLoading = false
					this.current = 0
					return false
				}
				if (!this.checkout(1)) {
					this.createLoading = false
					this.current = 1
					return false
				}
				if (!this.checkout(2)) {
					this.createLoading = false
					this.current = 2
					return false
				}
				if (!this.checkout(3)) {
					this.createLoading = false
					this.current = 3
					return false
				}

				if (this.user.length == 0) {
					this.$message.warning("请选择成员")
					this.createLoading = false
					return false
				}

				if (this.link_pic_url == '') {
					this.$message.warning("请选择图文封面")
					this.createLoading = false
					this.current == 2
					return false
				}

				if (this.link_start_title == '') {
					this.$message.warning("请填写图文标题")
					this.createLoading = false
					return false
				}

				//将红包金额四舍五入保留两位小数
				function returnFloat (value) {
					var value = String(Math.round(parseFloat(value) * 100) / 100);
					var xsd = value.toString().split(".");
					if (xsd.length == 1) {
						value = value.toString() + ".00";
						return value;
					}
					if (xsd.length > 1) {
						if (xsd[1].length < 2) {
							value = value.toString() + "0";
						}
						return value;
					}
				}

				this.panes.map(x => {
					x.amount = returnFloat(x.amount)
				})

				for (let i = this.province.length - 1; i > 0; i--) {
					if (this.province[i].length == 0) {
						this.province.splice(i, 1);
					}
				}

				const {data: res} = await this.axios.post("awards-activity/add", {
					corp_id         : this.corpId,
					agent_id        : this.agent_id,
					uid             : localStorage.getItem('uid'),
					id              : this.id,
					title           : this.title,
					start_time      : this.start_time,
					end_time        : this.end_time,
					description     : this.description,
					style           : this.style,
					poster_path     : this.poster_path,
					share_title     : this.share_title,
					init_num        : this.init_num,
					apply_setting   : this.apply_setting,
					award_setting   : this.award_setting,
					share_setting   : this.share_setting,
					content         : this.panes,
					user            : this.user,
					text_content    : this.textContent,
					link_start_title: this.link_start_title,
					link_desc       : this.link_desc,
					link_pic_url    : this.link_pic_url,
					back_pic_url    : this.back_pic_url,
					is_avatar       : this.is_avatar,
					avatar          : this.avatar,
					nickName        : this.nickName,
					qrCode          : this.qrCode,
					shape           : this.shape,
					is_nickname     : this.is_nickname,
					color           : this.color,
					font_size       : this.font_size,
					align           : this.align,
					prize_send_type : this.prize_send_type,
					sex_type        : this.sexType,
					area_type       : this.areaType,
					area_data       : this.province,
					tag_ids         : this.tag_arr.join(),
					is_share_open   : this.isNeedShare
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
					this.createLoading = false
				} else {
					this.createLoading = false
					localStorage.removeItem('notAllow')
					localStorage.removeItem('backUrl')
					if (this.id == '') {
						this.$router.push("/raffle/list")
					} else {
						this.$router.push("/raffle/list?isRefresh=1")
					}
				}
			},
			// 编辑获取详情
			async getDetail () {
				const {data: res} = await this.axios.post("awards-activity/detail", {
					id: this.id
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.currentStatus = res.data.status
					this.corpId = res.data.corp_id
					this.corpName = res.data.corp_name
					this.agent_id = String(res.data.agent_id)
					this.getAgentList(this.agent_id)
					this.title = res.data.title
					this.start_time = res.data.start_time
					this.end_time = res.data.end_time
					this.startValue = moment(this.start_time)
					this.endValue = moment(this.end_time)
					this.description = res.data.description
					this.style = res.data.style
					if (this.style == 1) {
						this.mobileImg = img1
					} else if (this.style == 2) {
						this.mobileImg = img2
					}
					this.poster_path = res.data.poster_path
					this.share_title = res.data.share_title
					this.apply_setting = res.data.apply_setting
					this.award_setting = res.data.award_setting
					this.isNeedShare = res.data.is_share_open
					this.share_setting = res.data.share_setting
					this.init_num = res.data.init_num

					this.back_pic_url = res.data.picRule.back_pic_url
					this.is_avatar = res.data.picRule.is_avatar
					this.avatar = res.data.picRule.avatar
					this.nickName = res.data.picRule.nickName
					this.qrCode = res.data.picRule.qrCode
					this.shape = res.data.picRule.shape
					this.is_nickname = res.data.picRule.is_nickname
					this.color = res.data.picRule.color
					this.font_size = res.data.picRule.font_size
					this.align = res.data.picRule.align

					this.prize_send_type = res.data.prize_send_type
					this.sexType = res.data.sex_type
					this.areaType = res.data.area_type
					this.province = res.data.area_data
					this.province.map(x => {
						if (this.currentStatus == 1) {
							x.disabled = true
						}
					})

					if (res.data.tag_ids.length > 0) {
						res.data.tag_ids.map((tagId) => {
							this.tag_arr.push(String(tagId));
						})
					}
					this.isShowTag = true

					this.panes = res.data.content
					this.panes.map(x => {
						if (x.prize_type == 1) {
							x.name = ''
						} else {
							x.amount = 1
						}
					})
					this.activeKey = this.panes[0].key
					this.$forceUpdate()

					this.posterBackHeight()

					this.user = res.data.user_key
					this.chooseNum = res.data.user_key.length
					this.chooseUserNum = 0
					this.chooseDepartmentNum = 0
					this.user.map(x => {
						if (x.scopedSlots.title == 'custom') {
							this.chooseUserNum++
						} else if (x.scopedSlots.title == 'title') {
							this.chooseDepartmentNum++
						}
					})


					this.textContent = res.data.welcome.text_content
					this.textAreaValueHeader = res.data.welcome.text_content.replace(/{nickname}/g,
						'<span>&nbsp;<span contenteditable="false" class="ant-tag ant-tag-orange">客户名称</span>&nbsp;</span>'
					).replace(/\n/g, '<br>')
					let a = this.textContent.replace(/{nickname}/g, ' 客户名称 ').replace(/\n/g, '').replace(/(<\/?a.*?>)/g, '')
					this.wordNum = a.length
					this.link_start_title = res.data.welcome.link_start_title
					this.link_desc = res.data.welcome.link_desc
					this.link_pic_url = res.data.welcome.link_pic_url
					this.editorFlag = true
				}
			},
			changeText (text, textVale) {
				this.textContent = text
				this.textAreaValueHeader = textVale
			}
		},
		mounted () {
			let _this = this
			if (typeof this.$route.query.id != 'undefined') {
				this.id = this.$route.query.id
				//不允许修改企业微信或公众号
				localStorage.setItem('notAllow', 1)
				localStorage.setItem('backUrl', '/raffle/list')
				this.getDetail()
			} else {
				this.editorFlag = true
				this.getAgentList()
			}
		}

	}
</script>

<style lang="less" scoped>
	@import '../../../style/_style.less';

	.current0 {
		margin-bottom: 1.5%;
	}

	.fission-add {
		position: absolute;
		width: 100%;
		height: calc(100% - 20px);
		/*overflow-y: auto;*/
	}

	.fission-content {
		width: calc(100% - 40px);
		height: calc(100% - 180px);
		background-color: #FAFAFA;
		margin: 0 auto;
		margin-top: 20px;
		overflow-y: hidden;
	}

	.steps-content {
		border-radius: 6px;
		height: 100%;
		padding: 20px;
		overflow-y: auto;
		position: relative;
	}

	.steps-action {
		position: fixed;
		bottom: 0px;
		left: 50%;
		transform: translate(-50%, 0%);
		height: 60px;
		line-height: 60px;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 50px;
	}

	/deep/ .ant-input-number-handler-wrap {
		display: none;
	}

	/deep/ .ant-steps-item-icon {
		width: 28px !important;
		height: 28px !important;
	}

	/deep/ .ant-steps-item-icon > .ant-steps-icon {
		top: -3px !important;
	}

	/deep/ .ant-steps-item-title {
		font-size: 14px !important;
	}

	.img-left {
		float: left;
		width: 379px;
		height: calc(100% - 40px);
		margin: 20px;
		overflow: auto;
	}

	.logo-style /deep/ .ant-upload.ant-upload-select-picture-card {
		width: 64px;
		height: 64px;
		overflow: hidden;
		float: left;
	}

	.link_pic_url_style /deep/ .ant-upload.ant-upload-select-picture-card {
		width: 96px;
		height: 96px;
		overflow: hidden;
		float: left;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card {
		width: 375px;
		height: 216px;
		overflow: hidden;
	}

	/deep/ .ant-divider-horizontal {
		margin: 12px 0 24px 0;
	}

	/deep/ .ant-form-item-label {
		width: 150px;
		margin-right: 20px;
	}

	/deep/ .ant-form-item-control-wrapper {
		width: calc(100% - 170px);
		float: right;
	}

	.mt {
		margin-bottom: 15px;
		overflow: hidden;
	}

	.item-info {
		/deep/ p {
			margin: 0;
			word-break: break-word;
		}
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

	.msg_content_body {
		border-radius: 4px;
		font-size: 14px;
		color: #333333;
		margin: 20px;
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

	.shape-active {
		background-color: #01b065;
		color: #FFFFFF;
	}

	.radus {
		border-radius: 50%;
	}

	/deep/ .ant-popover .ant-popover-message > .anticon {
		display: none !important;
	}

	.color-show {
		width: 20px;
		height: 20px;
		display: inline-block;
		margin: 0 10px;
		vertical-align: sub;
		border: 1px solid #BFBFBF;
	}

	/deep/ .ant-popover-inner-content {
		padding: 0 !important;
	}

	/deep/ .vdr {
		border: 1px dashed #FFF !important;
	}

	.page-content {
		width: 250px;
		height: 330px;
		position: absolute;
		/*background-color: #F5F5F5;*/
	}

	.content-msg {
		font-size: 13px;
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		margin-top: 12px;
	}

	/deep/ .ant-upload-picture-card-wrapper {
		width: auto;
		float: left;
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

	.corp-choose-tag /deep/ .ant-form-item-label {
		margin-right: 0;
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 0;
	}
</style>
