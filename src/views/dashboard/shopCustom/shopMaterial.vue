<template>
	<div class="mate-set">
		<a-layout style="position: relative; height: 100%; overflow: hidden">
			<a-layout class="scroll" style="position: absolute;left: 0;top:0;bottom:0;right:0; overflow-x: hidden; overflow-y: auto;">
				<!-- 头部 -->
				<a-layout-header>电商素材</a-layout-header>
				<!-- 内容 -->
				<a-layout-content>
					<div style="padding: 15px 20px;background: #FFF;">
						<div class="content-msg">
							<p style="margin-bottom: 0px;">
								1、需要有自建应用才可以使用电商素材功能
							</p>
							<p style="margin-bottom: 0px;">
								2、默认已经有对接的电商系统，欢迎咨询管理员了解。若需要对接第三方电商系统，也可与我们联系。
							</p>
							<p style="margin-bottom: 0px;">
								3、可实现电商素材转发给客户，并进行溯源和转化统计的功能。
							</p>
							<p style="margin-bottom: 0px;">
								4、可转发小程序或H5页面，小程序需要提前绑定企业微信。
							</p>
							<p style="margin-bottom: 0px;">
								5、复制下面页面地址，可以去企业微信后台添加聊天侧边栏。
							</p>
						</div>
						<div class="content-hd">
							<div class="content-box">
								<div class="guide-role">
									<div class="mate-title">
										<span>电商素材配置</span>
									</div>
									<div class="mate-statis-list">
										<a-form>
											<a-form-item label="页面标签:" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
												<a-checkbox-group @change="onChangeTip" v-model="tipId" :default-value="tipId">
													<a-checkbox :value="item.id" v-for="(item,index) in tipArr" :key="index">{{item.name}}</a-checkbox>
												</a-checkbox-group>
												<a-tooltip placement="top">
													<template slot="title">
														<div>勾选已与商城对接的标签，至少选一项</div>
													</template>
													<a-icon type="question-circle" theme="filled" style="margin-left:5px;color: #000000;"/>
												</a-tooltip>
											</a-form-item>
											<a-form-item label="小程序appid:" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
												<a-input placeholder="请输入" v-model="appid"></a-input>
												<a-tooltip placement="top">
													<template slot="title">
														<div>需要先将小程序关联到企业微信后台</div>
													</template>
													<a-icon type="question-circle" theme="filled" style="margin-left:5px;color: #000000;"/>
												</a-tooltip>
											</a-form-item>
											<a-form-item label="H5商城:" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
												<a-switch default-checked @change="onShop($event)" v-model="openShop" />
											</a-form-item>
											<a-form-item label="页面地址:" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
												<a-input placeholder="请输入" v-model="pageUrl"></a-input>
												<a style="margin-left: 10px;vertical-align: middle;"
													@click="copyText(pageUrl)">复制</a>
											</a-form-item>
										</a-form>
									</div>
								</div>
							</div>
							<div class="content-box">
								<div class="guide-set">
									<div class="mate-title">
										<span>发送效果展示</span>
									</div>
									<div class="mate-show-list">
										<div class="list-item">
											<img src="../../../assets/ma.png" alt="加载失败">
											<p>小程序卡片</p>
										</div>
										<div class="list-item">
											<img src="../../../assets/customManage/guide.png" alt="加载失败">
											<p>文字+H5链接</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="content-bd">
							<a-button type="primary" @click="saveMate">保存</a-button>
						</div>
					</div>	
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>

<script>
	export default{
		name: "shopMaterial",
		components:{},
		data(){
			return {
				loading: false,//加载
				tipId: [1,3],//页面标签选中的id
				tipArr: [{
					"id":1,
					"name":"商品",
					"checked":1
				},{
					"id":2,
					"name":"页面",
					"checked":0
				},{
					"id":3,
					"name":"优惠券",
					"checked":1
				}],//页面标签
				appid: '',//小程序appid
				openShop: false,//H5商城
				pageUrl: 'http://m.fastwhale.com.cn/h5/pages/scrm/shopcontent?agent_id=1120&corpid=ww25707817d75831a6',//页面地址
			}
		},
		methods: {
			
			async mateSet (){//电商素材基础配置接口
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
					
					that.tipArr = res.data.role
					that.tipId = res.data.config.role
				}
			},
			onChangeTip (checkedValues){//页面标签复选框
				this.tipId = checkedValues
			},
			onShop(checked){//H5商城开启切换
				this.openShop = checked
			},
			copyText (value) {//复制链接
				let that = this
				const input = document.createElement('input')
				document.body.appendChild(input)
				input.setAttribute('value', value)
				input.select()
				if (document.execCommand('copy')) {
					document.execCommand('copy')
					that.$message.success("复制成功！")
				}
				document.body.removeChild(input)
			},
			async saveMate(){//导购设置保存
				let that = this
				that.loading = true
				let params = {
					corp_id: localStorage.getItem('corpId') ? localStorage.getItem('corpId') : "",
					role: that.tipId.toString(),
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
			
				// this.mateSet()
			});
		}
	}
</script>

<style lang='less' scoped>
	@import '../../../style/_style.less';
	
	.mate-set{
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
		.mate-title{
			font-size: 16px;
			font-weight: 600;
			margin: 10px;
		}
		.mate-statis-list{
			.ant-checkbox-group{
				width: auto;
			}
			.ant-input{
				width: 210px;
			}
		}
		.mate-show-list{
			display: flex;
			.list-item{
				margin-left: 50px;
				margin-top: 20px;
				text-align: center;
				font-size: 16px;
				font-weight: 600;
				img{
					width: 200px;
				}
				p{
					margin-top: 12px;
				}
			}
		}
	}
</style>
