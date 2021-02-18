<template>
	<div class="login">
		<img src="~@/assets/login_logo.png" alt="">
		<div class="box">
			<div class="item">
				<p>还没有企业微信？</p>
				<div>注册包含云美来SCRM的企业微信</div>
				<a-button type="primary" @click="toggleModal">注册企业微信</a-button>
			</div>
			<div class="item">
				<p>已有企业微信？</p>
				<div>极速安装云美来SCRM到企业微信</div>
				<a-button type="primary" @click="toWork">安装到企业微信</a-button>
			</div>
		</div>
		<a-modal :visible="visible" :closable="false" title="" width="400px!important">
				<template slot="footer">
					<!--				<a-button key="submit" type="primary" @click="toRegister">重新注册</a-button>-->
				</template>
				<div style="text-align: right; height: 15px;">
					<a-icon @click="handleCancel" type="close"></a-icon>
				</div>
				<div style="margin-top: 30px;" v-text="noticeText"></div>
				<div style="text-align: center; margin-top: 20px;">
					<a-button type="primary" v-if="continueStatus" :loading="loading" @click="toRegister">继续</a-button>
					<a-button type="primary" v-if="!continueStatus" @click="endRegister">已完成注册</a-button>
				</div>
				<div style="text-align: right;">
					<a-button style="color: #C3C3C3;" v-if="!continueStatus" type="link" @click="toRegister">重新注册
					</a-button>
				</div>
			</a-modal>
	</div>
</template>

<script>
	export default {
		name   : "freeRegister",
		data () {
			return {
				visible         : false, // 未注册点击弹窗
				continueStatus  : true, // true 继续 false 已完成注册
				register_code   : '', // 注册code
				time            : '', // code有效期
				timeInterval    : 0, // code有效期定时器id
				registerInterval: false, // 注册状态
				isRegister      : false, // 是否注册
				loading         : false, // 继续按钮loading
				cnfId           : this.$store.state.sid, // 授权应用的ID
				normalText      : "点击【继续】后将为你打开新网页注册企业微信，请在完成注册后回到本页面进行后续操作",
				registerText    : "企业微信注册已完成，请点击【已完成注册】",
				noticeText      : this.normalText,
			}
		},
		created() {
			let that = this
			document.addEventListener('visibilitychange',function(){ //浏览器切换事件
				if(document.hidden) { //状态判断
					if(that.registerInterval) {
						clearInterval(that.registerInterval)
					}
				} else {
					if(!that.continueStatus && that.visible) {
						if(that.registerInterval) {
							clearInterval(that.registerInterval)
						}
						that.registerInterval = setInterval(that.getIsRegister, 1000)
					}
				}
			});
		},
		methods: {
			// 注册弹窗
			toggleModal () {
				this.noticeText = this.normalText
				this.visible = true
			},
			// 取消注册
			handleCancel () {
				clearInterval(this.timeInterval)
				clearInterval(this.registerInterval)
				this.continueStatus = true
				this.visible = false
				this.noticeText = this.normalText
			},
			// 扫码登录
			toWork () {
				const redirectUri = encodeURIComponent(this.$store.state.siteUrl + '/workBinding')
				location.href = `${this.$store.state.commonUrl}/work-bind/index?cnf_id=${this.cnfId}&uid=&redirect_uri=${redirectUri}&auth_type=0&from_type=1`
			},
			// 手机号注册
			taggerPhone () {
				this.$router.push('/register')
			},
			// 跳转注册
			async toRegister (type) {
				this.loading = true
				const {data: res} = await this.axios.get('work-auth/get-code', {
					params: {
						pid: this.$store.state.pid,
						tid: this.$store.state.tid,
					}
				})
				if (res.error == 0) {
					let that = this
					this.loading = false
					this.time = res.data.expires_in
					this.register_code = res.data.register_code
					this.timeInterval = setInterval(function () {
						that.time--
						if (that.time == 0) {
							clearInterval(that.timeInterval)
							that.toRegister(1)
						}
					}, 1000)
					if (type != 1) {
						clearInterval(this.registerInterval)
						this.registerInterval = setInterval(that.getIsRegister, 1000)
						this.continueStatus = false
						window.open('https://open.work.weixin.qq.com/3rdservice/wework/register?register_code=' + res.data.register_code)
					}
				} else {
					this.loading = false
					this.$message.destroy()
					this.$message.warning(res.error_msg, 2)
				}
			},
			async getIsRegister () {
				const {data: res} = await this.axios.post('work-auth/register-status', {
					pid : this.$store.state.pid,
					tid : this.$store.state.tid,
					code: this.register_code
				})
				if (res.error == 0) {
					this.isRegister = true
					localStorage.setItem('bind_corp_id', res.data.corp_id)
					this.noticeText = this.registerText;
					clearInterval(this.registerInterval)
				} else {
					this.isRegister = false
				}
			},
			// 已完成注册
			endRegister () {
				if (!this.isRegister) {
					this.$message.destroy()
					this.$message.warning('您还未注册企业微信，请完成企业微信注册后继续', 2)
					return false
				}

				this.$router.push('/workBinding')
			}

		},
	}
</script>

<style scoped lang='less'>
	.login {
		width: 100%;
		height: 100%;
		position: relative;
		background: url('~@/assets/register_bg.png') no-repeat bottom;
		background-size: 100% auto;
		img{
			width: 77px;
			height: 28px;
			position: absolute;
			left: 160px;
			top: 60px;
		}
		.box{
			width: 900px;
			height: 438px;
			box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
			border-radius: 20px;
			display: flex;
			position: absolute;
			top: 40%;
			left: 50%;
			transform: translate(-50%,-50%);
			.item{
				flex: 1;
				text-align: center;
				color: #666;
				font-size: 14px;
				&:first-child{
					border-right: 2px solid #EEEEEE;
				}
				p{
					font-weight: 500;
					color: #01B065;
					font-size: 20px;
					margin-top: 120px;
					margin-bottom: 40px;
				}
				/deep/.ant-btn{
					height: 40px;
					margin-top: 86px;
					border-radius: 8px;
				}
			}
		}
	}

	/deep/ .ant-modal-footer {
		display: none;
	}

	.regster-view {
		display: flex;
		align-items: center;
		float: left;
		height: 100%;
		width: calc(50% - 1px);
		text-align: center;
	}

	.register-content {
		width: 100%;
	}

	.title {
		font-size: 20px;
		font-weight: 600;
		color: #01b065;
	}

	.desc {
		font-size: 16px;
		font-weight: 400;
		color: #666;
		margin: 50px 0 87px 0;
	}

	.one-erweima {
		cursor: pointer;
		position: absolute;
		right: 0px;

		img {
			width: 54px;
			height: 54px;
			float: right;
		}
	}

	.one-paopao {
		cursor: pointer;
		width: 120px;
		height: 35px;
		background-color: #FFB637;
		border-radius: 4px;
		display: inline-block;
		position: absolute;
		right: -120px;
		color: #FFF;
		font-size: 14px;
		box-sizing: border-box;
		padding-top: 6px;

		img {
			margin-left: 20px;
		}
	}
</style>