<template>
	<div style="width: 100%;max-height:100%;position: absolute;overflow-y: auto;padding-bottom: 30px;">
		<div>
			<a-card style="margin-bottom:20px;padding:10px 20px;">
				<label class="tpl-title">客户详情</label>
				<a-button type="primary"  style="font-size: 14px;float: right;" @click="goBack">返回列表
				</a-button>
			</a-card>

			<!-- 表格部分 -->
			<div class="content-bd">
				<a-spin tip="加载中..." size="large" :spinning="isLoading">
					<div class="custom-info">
						<a-avatar shape="square" :size="132"
						          :src="avatar"
						          style="vertical-align: top;"/>
						<div class="custom-info-text">
							<div class="col">
								<span style="font-size: 20px;font-weight: 700;">{{name}}
									<span v-if="corp_name != ''" :class="corp_name != null ? 'corp-name' : 'wx-name'">
										<template v-if="corp_name != null">@{{corp_name}}</template>
										<template v-else>@微信</template>
									</span>
								<span v-if="!remarkVisible && nickname != ''">（{{nickname}}）</span>
									<a-icon slot="prefix" type="man" style="color: #427EBA;" v-if="gender == '男性'"/>
									<a-icon
											slot="prefix"
											type="woman"
											style="color: #ED4997;" v-if="gender == '女性'"
									/>
								</span>
								<a-tag color="#67c23a"
								       style="float: right;margin-right: 0;height: 25px;line-height: 25px;"
								       v-if="followTitle">{{followTitle}}
								</a-tag>
							</div>
							<div class="col" v-if="is_hide_phone != 1">
								<label>
									手机：<span v-if="phone && phone != ''">{{phone}}</span><span v-else>暂无</span>
								</label>
							</div>
							<div class="col">
								<label>
									所在地：<span v-if="area && area != ''">{{area}}</span><span v-else>暂无</span>
								</label>
							</div>
							<div class="col">
								<span>
									<label>标签：</label>
									<span style="display: inline-block;width: calc(100% - 45px);vertical-align: text-top;">
										<a-tag v-for="item in hasTagsValue" color="blue" style="margin-bottom: 5px;"
										       v-if="hasTagsValue && hasTagsValue.length > 0">{{item}}</a-tag>
										<span v-if="hasTagsValue.length == 0">暂无</span>
									</span>
								</span>
							</div>
							<div class="col">
								<span>
									<label>描述：</label>
									<span v-if="des && des != ''">{{des}}</span>
									<span v-if="des == ''">暂无</span>
									<img v-if="file3" :src="this.commonUrl+file3" alt="avatar"
									     style="max-width: 100px;max-height: 100px;margin: 0 0 10px 10px;"/>
								</span>
							</div>
						</div>
						<div class="custom-info-box">
							<div class="box">
								<p class="box-first">预计成交率</p>
								<p class="box-second">
									<span v-if="!closeRateVisible && close_rate !== null">{{close_rate}} %</span>
									<span v-if="!closeRateVisible && close_rate === null">暂无</span>
								</p>
							</div>
							<div class="box">
								<p class="box-first">所在群<span v-if="chatName.length > 2">（{{chatName.length}}个）</span>
								</p>
								<p class="box-second" v-for="item in chatName"
								   v-if="chatName && chatName.length > 0">
									<a-popover placement="top">
										<template slot="content">
											<div style="max-width: 300px;">
												{{item.name}}（{{item.join_time}}）
											</div>
										</template>
										<span style="cursor: pointer; display: inline-block; max-width: 180px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{item.name}}（{{item.join_time}}）</span>
									</a-popover>
								</p>
								<p class="box-second" v-if="!chatName || chatName.length == 0">暂无</p>
							</div>
							<div class="box">
								<p class="box-first">上次联系</p>
								<p class="box-second">
									<span v-if="follow_time && follow_time != ''">{{follow_time}}</span>
									<span v-else>暂无</span>
								</p>
							</div>
							<div class="box">
								<p class="box-first">联系次数</p>
								<p class="box-second">
									<a-popover placement="top">
										<template slot="content">
											<div style="max-height: 300px;overflow-y: auto;">
												<div v-for="item in follow_times">{{item.name}}：{{item.follow_num}}次
												</div>
											</div>
										</template>
										<span v-if="follow_num && follow_num != ''" style="cursor: pointer;">{{follow_num}}</span>
									</a-popover>
									<span v-if="follow_num == '' || follow_num == null">暂无</span>
								</p>
							</div>
							<div class="box">
								<p class="box-first">归属企业成员</p>
								<p class="box-second" v-for="item in memberInfo"
								   v-if="memberInfo && memberInfo.length > 0">
									<a-popover placement="top">
										<template slot="content">
											{{item.member}}({{item.create_time}})
										</template>
										<span style="display: inline-block; max-width: 250px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;cursor: pointer;">
											{{item.member}}({{item.create_time}})
										</span>
									</a-popover>
								</p>
								<p v-else>暂无</p>
							</div>
						</div>
						<div class="custom-info-project single-accout-card" v-if="projectList.length > 0">
							<a-steps progress-dot :current="projectList.length-1">
								<a-step v-for="item in projectList">
									<template slot="title">
										{{item.project_name}}
									</template>
									<div slot="description">
										<div v-if="item.status == 3">项目实际完成：{{item.finish_time}}
											<span v-if="item.is_finish == 1">（按时完成）</span>
											<span style="color: red;" v-if="item.is_finish == 2">（逾期{{item.delay_days}}天完成）</span>
											<span v-if="item.is_finish == 3">（提前{{item.pre_days}}天完成）</span>
										</div>
										<div v-if="item.status != 1">项目开始时间：{{item.start_time}}</div>
										<div v-if="item.status != 1">预计截止时间：{{item.end_time}}</div>
										<div v-if="item.status == 1">项目规则：接到任务起，需要在{{item.days}}天内完成</div>
										<div>项目处理人：{{item.name}}</div>
									</div>
								</a-step>
							</a-steps>
						</div>
						<div class="custom-info-tab">
							<a-tabs v-model="tabKey" type="card" @change="changeTab">
								<a-tab-pane tab="跟进记录" key="1">
									<div class="time">
										<a-timeline class="time-line">
											<a-timeline-item v-for="item in followRecord">
												<div class="time-line-time">{{item.time}}</div>
												<img slot="dot" src="../../../assets/icon/8.png"
												     style="width: 18px;"/>
												<div style="margin: 10px 0;"><span
														style="color: #1989FA;">{{item.name}}</span> 发表：
													<span style="color: red;" v-if="item.follow_status != ''">【{{item.follow_status}}】</span>
												</div>
												<div class="time-line-title">
													{{item.record}}
													<div v-if="item.file.length > 0"
													     style="margin-top: 5px;overflow: hidden;">
														<div v-for="url in item.file" class="preview-box">
															<div class="preview-cover">
																<img :src="commonUrl + url" alt="">
															</div>
															<span class="preview-cover-icon"
															      @click="previewHasImg(commonUrl + url)"><a-icon
																	type="eye"/></span>
														</div>
													</div>
												</div>
											</a-timeline-item>
										</a-timeline>
										<!--分页 -->
										<div class="pagination"
										     style="margin: 20px 0;box-sizing: border-box;overflow: hidden;"
										     v-show="total > 0">
											<div style="height: 32px;float: left;line-height: 32px;">
												共
												<span style="color: blue">{{total}}</span>条
											</div>
											<div class="pagination" style="height: 32px;float: right;">
												<a-pagination :total="total" showSizeChanger
												              :showQuickJumper="quickJumper"
												              :current="page"
												              :pageSize="pageSize"
												              :pageSizeOptions="['15','30','50','100']"
												              @change="changePage"
												              @showSizeChange="showSizeChange"/>
											</div>
										</div>
									</div>
								</a-tab-pane>
								<a-tab-pane tab="互动轨迹" key="2">
									<a-timeline class="time-line" style="margin: 20px;">
										<a-timeline-item v-for="item in interactList">
											<img v-if="item.icon==1" slot="dot" src="../../../assets/icon/1.png"
											     style="width: 22px;"/>
											<img v-if="item.icon==2" slot="dot" src="../../../assets/icon/2.png"
											     style="width: 22px;"/>
											<img v-if="item.icon==3" slot="dot" src="../../../assets/icon/3.png"
											     style="width: 22px;"/>
											<img v-if="item.icon==4" slot="dot" src="../../../assets/icon/4.png"
											     style="width: 26px;"/>
											<img v-if="item.icon==5" slot="dot" src="../../../assets/icon/5.png"
											     style="width: 26px;"/>
											<img v-if="item.icon==6" slot="dot" src="../../../assets/icon/6.png"
											     style="width: 18px;"/>
											<img v-if="item.icon==8" slot="dot" src="../../../assets/icon/8.png"
											     style="width: 18px;"/>
											<img v-if="item.icon==10" slot="dot" src="../../../assets/icon/10.png"
											     style="width: 18px;"/>
											<img v-if="item.icon==11" slot="dot" src="../../../assets/icon/11.png"
											     style="width: 18px;"/>
											<img v-if="item.icon==12" slot="dot" src="../../../assets/icon/12.png"
											     style="width: 16px;"/>
											<a-icon type="pay-circle" slot="dot" v-if="item.icon==13"/>
											<div style="min-height: 40px;">
												<div class="time-line-time">{{item.event_time}}</div>
												<div class="time-line-title">{{item.content}}</div>
											</div>
										</a-timeline-item>
									</a-timeline>
									<div style="text-align: center;">
										<a-button type="primary" v-if="btnFlag==1" @click="loadMore">加载更多</a-button>
										<span type="primary" v-if="btnFlag==2">没有更多数据了</span>
									</div>
								</a-tab-pane>
								<a-tab-pane tab="用户画像" key="3">
									<div class="col2">
										<div class="half" v-for="(item, index) in field_list" v-if="item.key == 'phone' && is_hide_phone != 1 || item.key != 'phone'">
											<a-tag color="#01b065">{{item.title}}</a-tag>
											<span class="half-text"
											      v-if="!badicInfoVisible && item.value != '' && item.type != 8 && item.key != 'phone' && item.key != 'company'">{{item.value}}</span>
											<span class="half-text"
											      v-if="!badicInfoVisible && item.key == 'phone'">
												<span v-if="phone != ''">{{phone}}</span>
												<span v-if="phone == ''">暂无</span>
											</span>
											<span class="half-text"
											      v-if="!badicInfoVisible && item.key == 'company'">
												<span v-if="company != ''">{{company}}</span>
												<span v-if="company == ''">暂无</span>
											</span>
											<span class="half-text"
											      v-if="!badicInfoVisible && item.value.length != 0 && item.type == 8">
												<img v-for="item1 in item.value" @click="preview(commonUrl + item1.url)"
												     :src="commonUrl + item1.url"
												     style="max-width: 70px; max-height: 70px;margin: 2px;line-height: 0px;cursor: pointer;">
											</span>
											<span class="half-text"
											      v-if="!badicInfoVisible && (item.value == '' || item.value.length == 0) && item.key != 'phone' && item.key != 'company'">暂无</span>
										</div>
									</div>
								</a-tab-pane>
							</a-tabs>
						</div>
					</div>
				</a-spin>
			</div>
		</div>
		<!--图片预览-->
		<a-modal :visible="previewVisible" :footer="null"
		         @cancel="handleCancel">
			<img alt="example" style="width: 100%" :src="previewImage"/>
		</a-modal>
	</div>
</template>

<script>
	import cityData from "../../../common/js/citydata2.js";
	import moment from "moment";
	import "moment/locale/zh-cn";

	moment.locale("zh-cn");

	function getBase64 (file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			// reader.onerror = error => reject(error);
		});
	}

	export default {
		components: {},
		data () {
			let corpId = localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "";
			return {
				corpId          : corpId,//企业微信选中的id
				is_hide_phone   : 0,
				isLoading       : false, //Loading 组件显示与隐藏
				commonUrl       : this.$store.state.commonUrl,//公共的链接
				remarkVisible   : false,//是否修改备注
				confirmLoading2 : false,//打标签对话框的确认按钮加载
				id              : '',//客户id
				avatar          : '',//头像
				name            : '',//名称
				corp_name       : '',//企业名称
				nickname        : '',//设置的昵称
				gender          : '',//性别
				followTitle     : '',
				is_follow_del   : '',//当前跟进状态是否为已删除，1是
				phone           : '',//手机号
				phone2          : '',//暂存的手机号，方便取消时赋值
				company         : '',//公司
				company2        : '',//暂存的公司，方便取消时赋值
				area            : '',//地区
				des             : '',//描述
				//打标签
				visible         : false,
				hasTags         : [],//在别的地方打的已有的标签id
				hasTagsValue    : [],//在别的地方打的已有的标签名称
				tagCheckValue   : [],//该客户已有标签
				tagCheckValue2  : [],//该客户已有标签
				disabled        : [],//禁选标签
				tagsList        : [], //标签列表
				tagValue        : [],//新建标签的数组
				addTagVisible   : false,//新建标签弹窗显示与隐藏
				confirmLoading3 : false, //新建标签弹框加载
				inputValue      : '',//新建标签输入框值
				editGroupId     : '',//新建标签弹窗里的选中的分组id
				groupList       : [], // 小组列表
				groupId         : '-1', // 选中的小组id
				tagLoading      : false,//增加标签弹窗加载的显示与隐藏
				desVisible      : false,//修改描述弹窗的显示与隐藏
				imageUrl3       : '',//修改描述弹窗中图片链接地址
				file3           : '',//页面展示的修改描述图片链接地址
				desImgLoading   : false,//描述图片上传加载的显示与隐藏
				desText         : '',//修改的描述字段
				follow_id       : '',//展示的跟进状态
				followStatus    : '',
				follows         : [],
				closeRateVisible: false,//是否修改成交率
				close_rate      : '',//成交率
				follow_time     : '',//上次联系
				follow_times    : [],//上次联系详细信息
				follow_num      : '',//联系次数
				memberInfo      : '',//归属企业成员
				chatName        : [], // 所在群
				field_list      : [],//基础信息
				fieldData       : [],//编辑基础信息参数
				badicInfoVisible: false,//基础信息是否编辑状态
				projectList     : [],//项目列表
				// 地域
				cityData,
				moment, //时间选择器
				//跟进记录
				followRecord    : [],//跟进记录数据
				imageUrl        : [],//上传的图片文件类型
				file            : [],//上传的图片链接地址
				imgNum          : 0,//上传的图片的数量
				msg             : '',//跟进记录输入框内容
				previewVisible  : false,//预览图片弹窗显示与隐藏
				previewImage    : '',//预览的图片链接
				isImg           : true,//上传图片符不符合规则
				submitDisabled  : true,//提交按钮的置灰
				record_id       : '',//选择编辑的记录id

				//修改跟进记录弹窗
				editVisible    : false,//修改跟进记录弹窗的显示与隐藏
				imageUrl2      : [],//上传的图片文件类型
				file2          : [],//上传的图片链接地址
				imgNum2        : 0,//上传的图片的数量
				msg2           : '',//跟进记录输入框内容
				previewVisible2: false,//预览图片弹窗显示与隐藏
				previewImage2  : '',//预览的图片链接
				isImg2         : true,//上传图片符不符合规则
				submitDisabled2: true,//提交按钮的置灰
				//分页
				total          : 1, //总条数
				quickJumper    : false, // 是否显示快速跳转的控件
				page           : 1, //页码
				pageSize       : 15, //每页数据条数
				status         : [],//跟进状态
				//互动轨迹
				interactList   : [],//互动轨迹数据列表

				picFile        : {},
				isImg3         : true,
				//分页
				page2          : 1, //页码
				btnFlag        : 1,//1加载更多，2没有更多数据
				tabKey         : '1',
				isMasterAccount: localStorage.getItem('isMasterAccount'),
				canEdit        : 1,//是否可以编辑客户跟进状态,1可以，0不可以
			};
		},
		methods   : {
			goBack () {
				this.$router.go(-1)
			},
			//获取信息
			async getInfo () {
				this.isLoading = true;
				const {data: res} = await this.axios.post("work-external-contact-follow-user/custom-detail", {
					uid            : localStorage.getItem('uid'),
					cid            : this.id,
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					sub_id         : localStorage.getItem('sub_id'),
				})

				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.message)
				} else {
					this.isLoading = false
					this.avatar = res.data.avatar
					this.name = res.data.name
					this.corp_name = res.data.corp_name
					this.nickname = res.data.nickname
					this.gender = res.data.gender
					this.phone = res.data.phone
					this.company = res.data.company
					this.followTitle = res.data.follow_title
					this.is_follow_del = res.data.is_follow_del
					this.area = res.data.area
					this.des = res.data.des
					this.file3 = res.data.path
					this.hasTags = []
					this.tagCheckValue = []
					this.hasTagsValue = []
					res.data.tag_name.map(x => {
						this.hasTags.push(x.tid)
						this.tagCheckValue.push(x.tid)
						this.hasTagsValue.push(x.tname)
					})
					this.follow_id = JSON.parse(JSON.stringify(res.data.follow_id))
					if (this.follow_id == '') {
						this.follow_id = this.follows[0] ? (this.follows[0].id ? this.follows[0].id : '') : ''
					}
					this.status = this.follow_id
					this.followStatus = this.follow_id
					this.close_rate = res.data.close_rate
					this.follow_time = res.data.follow_time
					this.follow_times = res.data.follow_times
					this.follow_num = res.data.follow_num
					this.memberInfo = res.data.memberInfo
					this.chatName = res.data.chat_name
					this.is_hide_phone = res.data.is_hide_phone

					this.getFollowStatus()

					this.field_list = res.data.field_list
					// this.field_list.unshift({
					// 	fieldid: "83",
					// 	key: "2_61",
					// 	title: "图片",
					// 	type: "8",
					// 	sort: "100",
					// 	optionVal: "",
					// 	value: [
					// 		{
					// 			url:"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
					// 			status: 'done'
					// 		}
					// 	],
					// })
					this.field_list.map(x => {
						if (x.type == 2 || x.type == 3) {
							x.optionVal2 = x.optionVal.split(',')
							if (x.type == 2) {
								if (x.value == '') {
									x.hasOption = x.value.split('')
								} else {
									x.hasOption = x.value
								}
							} else if (x.type == 3 && x.value != '') {
								x.hasOption = x.value.split(',')
							}
						} else if (x.type == 7) {
							if (x.value == '') {
								x.provice = []
							} else {
								x.provice = x.value.split('-')
							}
						} else if (x.type == 4) {
							x.data = x.value
						}
					})
					this.fieldData = res.data.field_list
					this.projectList = res.data.project
				}
			},
			disabledStartDate (date2) {
				//打开开始时间面板调用的函数
				return date2.valueOf() > new Date().getTime(); //大于今天的日期一律返回true，禁止选择
			},
			//切换tab
			changeTab (e) {
				if (e == 2) {
					this.btnFlag = 1
					this.getInteract(1)
				} else if (e == 1) {
					this.getFollowRecord()
				}
			},
			//获取跟进记录
			async getFollowRecord (page = 1, pageSize = this.pageSize) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-external-contact-follow-user/custom-follow-record", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					uid            : localStorage.getItem('uid'),
					corp_id        : this.corpId,
					cid            : this.id,
					sub_id         : localStorage.getItem("sub_id"),
					page           : page,
					page_size      : pageSize,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false
					this.total = parseInt(res.data.count);
					this.page = page;
					this.pageSize = pageSize;
					this.quickJumper = this.total > this.pageSize;
					this.followRecord = res.data.followRecord
				}
			},
			// 分页
			changePage (page, pageSize) {
				this.getFollowRecord(page, pageSize);
			},
			showSizeChange (page, pageSize) {
				this.getFollowRecord(1, pageSize);
			},
			//上传图片
			handleCancel () {
				this.previewVisible = false;
			},
			preview (url) {
				this.previewImage = url
				this.previewVisible = true;
			},
			//预览图片
			previewHasImg (url) {
				this.previewImage = url;
				this.previewVisible = true;
			},
			//获取互动轨迹
			async getInteract (page = 1) {
				this.isLoading = true
				const {data: res} = await this.axios.post("work-external-contact-follow-user/custom-track", {
					isMasterAccount: localStorage.getItem('isMasterAccount'),
					uid            : localStorage.getItem('uid'),
					corp_id        : this.corpId,
					cid            : this.id,
					sub_id         : localStorage.getItem("sub_id"),
					page           : page,
					page_size      : 15,
				});
				if (res.error != 0) {
					this.isLoading = false
					this.$message.error(res.error_msg);
				} else {
					this.isLoading = false
					this.page2 = page;
					if (res.data.length < 15) {
						this.btnFlag = 2
					} else {
						this.btnFlag = 1
					}
					if (page == 1) {
						this.interactList = res.data
					} else {
						this.interactList = this.interactList.concat(res.data)
					}
				}
			},

			//加载更多
			loadMore () {
				this.page2++
				this.getInteract(this.page2)
			},
			async getFollowStatus () {
				const {data: res} = await this.axios.post(
					"custom-field/follow",
					{
						uid   : localStorage.getItem("uid"),
						status: 1
					}
				);
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.follows = res.data.follow
					if (this.is_follow_del == 1) {
						let obj = {
							id    : this.follow_id,
							title : this.followTitle,
							status: 0
						}
						this.follows.unshift(obj)
					}
				}
			}
		},

		created () {
			this.id = this.$route.query.id
			this.getInfo();
			this.getFollowRecord()
		}
	}
	;
</script>

<style lang='less' scoped>
	/deep/ .ant-card-bordered {
		border: 0;
	}

	.tpl-title {
		float: left;
		font-size: 16px;
		vertical-align: top;
	}

	.content-bd {
		background: #FFF;
		min-height: 120px;
		border: 1px solid #E2E2E2;
		min-width: 885px;
		margin: 0 20px;
	}

	.custom-info {
		padding: 20px;
	}

	.custom-info-text {
		width: calc(100% - 132px);
		display: inline-block;
		height: 132px;
		padding: 0 15px;
	}

	.col {
		margin-bottom: 5px;
	}

	.custom-info-box {
		margin-top: 20px;
		overflow: hidden;
		text-align: center;
	}

	.box {
		padding: 20px 20px 0;
		height: 115px;
		width: 20%;
		border: 1px solid #E9E9E9;
		background-color: #F9F9F9;
		float: left;
		overflow: auto;
	}

	.box:nth-child(1), .box:nth-child(2), .box:nth-child(3) {
		border-right: 0;
	}

	.box-first {
		font-size: 16px;
	}

	.box-second {
		padding: 0;
		margin: 0;
		overflow: hidden;
	}

	.custom-info-tab {
		margin-top: 20px;
	}

	.col2 {
		overflow: hidden;
	}

	.half {
		width: 50%;
		float: left;
		line-height: 40px;
		padding: 0 20px;
		border-top: 1px solid #E9E9E9;
	}

	.half-text {
		float: right;
		word-break: break-all;
		max-width: calc(100% - 120px);
	}

	/deep/ .ant-tabs-top-content {
		padding-bottom: 0;
	}

	.time {
		border: 1px solid #E9E9E9;
		padding: 20px 20px 0;
	}

	.textArea-btn {
		padding: 20px 0 10px;
		overflow: hidden;
	}

	.upload-file /deep/ .ant-upload-picture-card-wrapper {
		display: inline;
	}

	.upload-file /deep/ .ant-upload.ant-upload-select-picture-card {
		background-color: #FFF;
		border: 0;
		height: 32px;
	}

	/deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
		padding: 0;
	}

	.time-line-title {
		background: #F9F9F9;
		padding: 10px;
		margin-top: 5px;
	}

	.preview-box {
		width: 104px;
		height: 104px;
		margin: 0 8px 8px 0;
		padding: 8px;
		border: 1px solid #D9D9D9;
		border-radius: 4px;
		position: relative;
		float: left;
	}

	.preview-cover, .preview-cover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: relative;
	}

	.preview-cover::before {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		opacity: 0;
		transition: all 0.3s;
		content: ' ';
	}

	.preview-cover-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 10;
		white-space: nowrap;
		transform: translate(-50%, -50%);
		opacity: 0;
		transition: all 0.3s;
		cursor: pointer;
		color: #FFF;
		font-size: 18px;
	}

	.preview-box:hover .preview-cover::before, .preview-box:hover .preview-cover-icon {
		opacity: 1;
	}

	/deep/ .ant-input-affix-wrapper .ant-input:not(:last-child) {
		padding-right: 58px;
	}

	.upload-pic /deep/ .ant-upload.ant-upload-select-picture-card, .upload-pic /deep/ .ant-upload-list-picture-card .ant-upload-list-item, .upload-pic /deep/ .ant-upload-list-picture-card-container {
		width: 70px;
		height: 70px;
	}

	.upload-pic /deep/ .ant-upload-select-picture-card i {
		font-size: 32px;
		color: #999;
	}

	.upload-pic /deep/ .ant-upload-select-picture-card .ant-upload-text {
		margin-top: 8px;
		color: #666;
	}

	/deep/ .ant-input-group-addon {
		padding: 0;
	}

	.custom-info-project {
		border: 1px solid #E9E9E9;
		background-color: #F9F9F9;
		margin-top: 20px;
		padding: 20px;
		overflow-x: auto;
	}

	/deep/ .ant-steps-dot .ant-steps-item-process .ant-steps-item-icon, .ant-steps-dot.ant-steps-small .ant-steps-item-process .ant-steps-item-icon {
		width: 8px;
		height: 8px;
	}

	/deep/ .ant-steps-dot .ant-steps-item-content, .ant-steps-dot.ant-steps-small .ant-steps-item-content {
		width: 200px;
	}

	/deep/ .ant-steps-dot .ant-steps-item-icon, .ant-steps-dot.ant-steps-small .ant-steps-item-icon {
		margin-left: 97px;
	}

	/deep/ .ant-steps-dot .ant-steps-item-tail, .ant-steps-dot.ant-steps-small .ant-steps-item-tail {
		margin: 0 0 0 100px;
	}

	.single-accout-card::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
		height: 10px;
	}

	/deep/ .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
		color: rgba(0, 0, 0, 0.85);
	}

	/deep/ .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description {
		color: rgba(0, 0, 0, 0.65);
	}

</style>