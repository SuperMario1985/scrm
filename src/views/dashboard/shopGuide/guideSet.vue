<template>
	<div class="guide-set">
		<a-layout style="position: relative; height: 100%; overflow: hidden">
			<a-layout class="scroll" style="position: absolute;left: 0;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;">
				<!-- 头部 -->
				<a-layout-header>导购设置</a-layout-header>
				<!-- 内容 -->
				<a-layout-content>
					<div style="padding: 15px 20px;background: #FFF;">
						<div class="content-hd">
							<div class="content-box" v-if="roleArr.length>0">
								<div class="guide-role">
									<div class="role-title">
										<span>导购包含角色</span>
										<a-tooltip placement="top">
											<template slot="title">
												<div>企业部分角色可能需要排除掉，不作为导购显示和管理</div>
											</template>
											<a-icon type="question-circle" theme="filled" style="margin-left:5px;color: #000000;"/>
										</a-tooltip>
									</div>
									<div class="rfm-statis-list">
										<a-form>
											<a-form-item label="勾选角色:" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
												<a-checkbox-group @change="onChangeRole" v-model="roleId" :default-value="roleId">
													<a-checkbox :value="item.id" v-for="(item,index) in roleArr" :key="index">{{item.name}}</a-checkbox>
												</a-checkbox-group>
											</a-form-item>
										</a-form>
									</div>
								</div>
							</div>
							<div class="content-box">
								<div class="guide-set">
									<div class="role-title">
										<span>导购关联设置</span>
										<a-tooltip placement="top">
											<template slot="title">
												<div>设置在哪些情况下会将员工设置为该顾客的导购</div>
											</template>
											<a-icon type="question-circle" theme="filled" style="margin-left:5px;color: #000000;"/>
										</a-tooltip>
									</div>
									<div class="rfm-statis-list">
										<a-form>
											<a-form-item label="导购关联模式选择:" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" v-if="0">
												<a-radio-group name="radioGroup" :default-value="1" v-model="mode_type">
													<a-radio :value="1">顾客对应多导购</a-radio>
													<a-radio :value="2">导购锁定+有效期</a-radio>
												</a-radio-group>
												<div style="color: #999999;">谨慎选择，模式切换将造成顾客原有的导购将不再生效。</div>
											</a-form-item>
											<a-form-item label="扫码添加时:" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
												<a-radio-group name="radioGroup" :default-value="1" v-model="priority">
													<a-radio :value="1">每个门店首个添加的企微好友成为导购</a-radio>
													<a-radio :value="2">首个添加的企微好友成为导购</a-radio>
													<a-radio :value="3">所有添加的企微好友都成为导购</a-radio>
												</a-radio-group>
											</a-form-item>
											<a-form-item label="顾客消费时:" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
												<a-radio-group name="radioGroup" :default-value="0" v-model="is_consumption">
													<a-radio :value="0">不做处理</a-radio>
													<a-radio :value="1">订单里若可关联员工则自动增加此员工为导购</a-radio>
												</a-radio-group>
												<a-tooltip placement="top">
													<template slot="title">
														<div>部分第三方支持导入订单会关联员工信息，具体联系客服了解。特殊情况：当此员工存在于多个门店中，订单同时需要有明确的门店信息，否则关联失败</div>
													</template>
													<a-icon type="question-circle" theme="filled" style="color: #000000;"/>
												</a-tooltip>
											</a-form-item>
										</a-form>
									</div>
								</div>
							</div>
							<div class="content-box">
								<div class="guide-role">
									<div class="role-title">
										<span>业绩归属设置</span>
										<a-tooltip placement="top">
											<template slot="title">
												<div>当通过全渠道导入的订单进行scrm，如何自动给这笔订单归属给某一个导购人员，订单里可能会携带员工信息，这需要对方系统支持。</div>
											</template>
											<a-icon type="question-circle" theme="filled" style="margin-left:5px;color: #000000;"/>
										</a-tooltip>
									</div>
									<div class="rfm-statis-list">
										<a-form>
											<a-form-item label="有订单导入时:" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
												<a-radio-group name="radioGroup" :default-value="0" v-model="performance_related">
													<a-radio :value="0">不关联</a-radio>
													<a-radio :value="1">优先归属给订单关联员工，没有相关信息则不处理</a-radio>
													<a-radio :value="2" v-if="0">优先归属给订单关联员工，没有相关信息归属给这个门店添加的首个员工</a-radio>
												</a-radio-group>
											</a-form-item>
										</a-form>
									</div>
								</div>
							</div>
						</div>
						<div class="content-bd">
							<a-button type="primary" @click="saveGuide">保存</a-button>
						</div>
					</div>	
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>

<script>
	export default{
		name: "guideSet",
		components:{},
		data(){
			return {
				loading: false,//加载
				roleId: [],//导购角色选中的id
				roleArr: [],//导购角色
				mode_type: 1,//关联模式
				priority: 1,//扫码添加
				is_consumption: 0,//顾客消费
				performance_related: 0,//订单导入
			}
		},
		methods: {
			
			async guideSet (){//导购设置基础配置接口
				let that = this;
				that.isLoading = true;
				const {data: res} = await that.axios.post("shop-customer-guide/get-config", {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
				});
				if (res.error != 0) {
					that.isLoading = false;
					that.$message.error(res.error_msg);
				} else {
					that.isLoading = false;
					
					that.roleArr = res.data.role
					if(res.data.config != null){
						that.roleId = res.data.config.role
						that.mode_type = res.data.config.mode_type
						that.priority = res.data.config.priority
						that.is_consumption = res.data.config.is_consumption
						that.performance_related = res.data.config.performance_related
					}
				}
			},
			onChangeRole (checkedValues){
				this.roleId = checkedValues
			},
			async saveGuide(){//导购设置保存
				let that = this
				that.loading = true
				let params = {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					role: that.roleId.toString(),
					mode_type: that.mode_type,
					priority: that.priority,
					is_consumption: that.is_consumption,
					in_page_lock: 1,
					add_friend_lock: 1,
					consumption_amount_lock: 1,
					performance_related: that.performance_related
				}
				const {data: res} = await that.axios.post("shop-customer-guide/update-attribution", params);
				if (res.error != 0) {
					that.loading = false
					that.$message.error(res.error_msg);
				} else {
					that.loading = false
					that.$message.success('保存成功')
				}
			},
		},
		mounted() {
			this.$store.dispatch('getCorp', (info) => {
			
				this.guideSet()
			});
		}
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	
	.guide-set{
		width: 100%;
		height: 100%;
	}
	.ant-layout-header{
		background: #FFF;
		border-bottom: 1px solid #E2E2E2;
		height: 50px;
		min-width: 885px;
		width: 100%;
		line-height: 50px;
		padding: 0 20px;
		font-size: 16px;
		text-align: left;
	}
	
	.ant-layout-content{
		margin: 20px;
		min-width: 885px;
		background-color: #FFFFFF;
	}
	.content-msg {
		border: 1px solid @border-color;
		background: @color-bgc;
		padding: 10px;
		text-align: left;
		margin-bottom: 20px;
	}
	.content-hd {
		margin-top: 20px;
		width: 100%;
		min-width: 885px;
	}
	.content-bd {
		background: #FFF;
		min-height: 120px;
		min-width: 885px;
		width: 100%;
		text-align: center;
		.ant-btn{
			margin-top: 50px;
		}
	}
	.content-box{
		background: #F5F5F5;
		border: 1px solid #E2E2E2;
		margin-bottom: 20px;
		padding: 10px;
		&:last-child{
			margin-bottom: 0;
		}
		.role-title{
			font-size: 16px;
			font-weight: 600;
			margin: 10px;
		}
	}
</style>
