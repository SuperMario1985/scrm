<template>
	<div style="width:100%;height:100%;position: absolute;overflow: auto;">
		<a-card style="margin-bottom:20px;padding:10px 20px;">
			<h3>账号设置</h3>
		</a-card>
		<div style="background: #FFF;height: calc(100% - 94.2px);margin: 20px;padding:40px 0;">
			<div class="user-body">
				<a-form>
					<a-form-item label="手机号码" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
						<div style="text-align: left;">{{account}}</div>
					</a-form-item>
					<a-form-item label="验证码" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
						<a-input type="text" placeholder="请输入验证码" v-model="code" style="width: 200px;" autocomplete="off"/>
						<a-button type="link" @click="getPassword"
						          :disabled="disabled" style="padding-right: 0px !important;width: 90px;">
							{{btnTitle}}
						</a-button>
					</a-form-item>
					<a-form-item label="新密码" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
						<a-input type="password" placeholder="请填写6-20位密码" v-model="password"
						         autocomplete="off"/>
					</a-form-item>
					<a-form-item label="确认新密码" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
						<a-input type="password" placeholder="请再输入一次密码" v-model="password2"
						         autocomplete="off"/>
					</a-form-item>
				</a-form>
				<a-button type="primary" block class="user-button" @click="userSave">保存</a-button>
			</div>
		</div>
	</div>

</template>

<script>

	export default {
		components: {},
		data () {
			return {
				code        : '',//验证码
				disabled    : false,
				btnTitle    : "获取验证码",
				password    : '',//新密码
				password2   : '',//确认新密码
				account     : localStorage.getItem('phoneNumber'),//手机号
			};
		},
		methods   : {
			//获取验证码
			async getPassword () {
				this.disabled = true
				const {data: res} = await this.axios.post('login/get-code', {
					account: this.account, //手机号
					type   : 'update',//获取手机验证码来源类型
				})
				if (res.error == 0) {
					//获取验证码成功弹出气泡
					this.$message.success('发送成功')
					//倒计时
					let time = 60;
					let timer = setInterval(() => {
						if (time == 0) {
							clearInterval(timer);
							this.disabled = false;
							this.btnTitle = "获取验证码";
						} else {
							this.btnTitle = time + '秒后重试';
							time--
						}
					}, 1000)
				} else {
					this.$message.error(res.error_msg)
					this.disabled = false;
				}
			},
			//保存
			async userSave () {
				if (this.code == '') {
					this.$message.error("请输入验证码");
				} else if (this.password == '') {
					this.$message.error("请输入新密码");
				} else if (this.password2 == '') {
					this.$message.error("请输入新密码");
				} else {
					const {data: res} = await this.axios.post("user/update", {
						code           : this.code,
						password       : this.password,
						password2      : this.password2,
						isMasterAccount: localStorage.getItem('isMasterAccount'),
						sub_id         : localStorage.getItem('sub_id'),
					});
					if (res.error != 0) {
						this.$message.error(res.error_msg);
					} else {
						this.$message.success('修改成功');
						this.global.clearLocalStorage()
						await this.sleep(1000)
						window.location.reload();
					}
				}
			},
			sleep (d) {
				return new Promise((resolve) => setTimeout(resolve, d))
			},
		},
		created () {
		}
	};
</script>

<style lang='less' scoped>
	.user-body {
		width: 435px;
		margin: 0 auto;
		text-align: center;
	}

	.user-button {
		width: 200px;
		margin-top: 10px;
	}

	/deep/ .ant-form-item-label {
		text-align: left;
	}

	/deep/ .ant-form-item {
		margin-bottom: 10px;
	}
</style>