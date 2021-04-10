<template>
	<div>
		<div class="phone_container" v-show="!isShrink">
			<div class="head">
				<img src="../../assets/call/shrink.png" @click="handleShrink"/>
			</div>

			<div class="content">
				<a-avatar shape="circle" :size="80"
				          style="z-index: 99"
				          :src="avatar?avatar:'../../assets/useradvart.png'"/>
				<div style="font-size: 15px;font-weight: 600">{{nickname}}</div>
				<div>
					{{currentText}}
					{{current}}
				</div>

				<img src="../../assets/call/hangup.png" style="width: 40px;cursor: pointer" @click="hangup(true)"/>

				<div style="color:red">通话时关闭当前页面可能会导致通话中断</div>
			</div>
			<div class="banner-bg"
			     :style="{backgroundImage: 'url(' + (avatar ? avatar : bg) + ')',backgroundSize: '100% 100%'}"></div>
		</div>

		<div class="phone_shrink" v-show="isShrink">
			<div class="head">
				<img src="../../assets/call/shrink.png" @click="handleEnlarge"/>
			</div>
			<a-avatar shape="circle" :size="80"
			          style="z-index: 99;margin-top: 15px"
			          :src="avatar?avatar:'../../assets/useradvart.png'"/>
			<div style="font-size: 15px;font-weight: 600">{{nickname}}</div>
			<div>{{currentText}}</div>
			<img src="../../assets/call/hangup.png" style="width: 40px;" @click="hangup(true)"/>
		</div>

		<a-modal v-model="showAddPhone" ok-text="确认" cancel-text="取消" @ok="hideModal"
		         @cancel="handleCancel">
			<p style="font-size:16px;">需要添加对方的个人微信吗？</p>
			<a-checkbox @change="toggleDisabled">
				直接跳过该提醒，下次直接进行电话拨打
			</a-checkbox>
		</a-modal>
	</div>
</template>

<script>
	import FastWhaleCall from '@/fastwhalecall'
	import PubSub from "pubsub-js";
	import bg from "../../assets/call/bg.jpg"

	export default {
		data () {
			return {
				isShrink        : false,
				avatar          : '',//头像
				nickname        : '',
				follow_id       : '',
				phone           : '',
				type            : '',
				isReady         : false,
				selectedCustomer: {},
				showCall        : false,
				fastwhalecall   : null,
				actionId        : '',
				current         : '',
				currentText     : '呼叫中',
				hour            : 0,
				minutes         : 0,
				seconds         : 0,
				time            : "",
				isRemind        : 0,
				showAddPhone    : false,
				remindTime      : '',
				bg              : bg

			}
		},
		props: {
			customerData: {
				type   : Object,
				default: {}
			},
		},

		mounted () {
			this.avatar = this.customerData.avatar
			this.nickname = this.customerData.nickname
			this.follow_id = this.customerData.follow_id
			this.phone = this.customerData.phone
			this.type = this.customerData.type
			this.callVertify()
		},
		methods: {
			async hideModal () {
				this.$copyText(this.phone).then(
					res => {
						this.$message.success("已成功复制，可直接去粘贴");
						PubSub.publish('showCall', {
							showCall: false,
						});
						this.cancelRemind()
					},
					err => {
						this.$message.error("复制失败");
					}
				)

			},
			async cancelRemind () {
				const {data: res} = await this.axios.post("dialout/ignore-tip", {
					ActionID: this.actionId,
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg);
				} else {
					this.showAddPhone = false
				}
			},
			toggleDisabled (e) {
				this.isRemind = e.target.checked
			},
			handleCancel () {
				this.showAddPhone = false
				PubSub.publish('showCall', {
					showCall: false,
				});
			},

			async callVertify () {
				const {data: res} = await this.axios.post("dialout/dialout-data", {
					follow_id: this.follow_id,
					corp_id  : localStorage.getItem('corpId'),
					type     : this.type
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
					PubSub.publish('showCall', {
						showCall: false,
					});
				} else {
					let that = this
					let {api_key, custom_key, bindExen: exten} = res.data
					that.fastwhalecall = new FastWhaleCall('7moor', {api_key, custom_key, exten})
					let registered = false
					let timeNum = 0
					let timer = setInterval(() => {
						if (registered) {
							that.isReady = true
							that.actionId = res.data.ActionID
							that.fastwhalecall.dialout(res.data.dialout_phone, res.data.ActionID)
							that.getRemind()
							clearInterval(timer)
							return
						}
						++timeNum
						if (timeNum > 50) {
							clearInterval(timer)
						}
					}, 100)

					that.fastwhalecall.on('onMessage', message => {
						console.log(11111111111111, message)
						if (message == 'registered') {
							registered = true
						} else if (message == 'EvtConnected') {
							that.time = setInterval(() => {
								that.checkCallState()
							}, 1000)
						} else if (message == 'EvtHangup' || message == 'hangup') {
							this.currentText = '呼叫中'
							this.current = ''
							this.fastwhalecall.hangup()
							this.showCall = false
							this.isShrink = false
							clearInterval(this.time);
							if (this.customerData.from == 1) {
								this.showTip()
								return
							}
							PubSub.publish('showCall', {
								showCall: false,
							});
						} else if (message == 'EvtDialing') {
							clearTimeout(that.remindTime)
						}
					})

					that.fastwhalecall.on('errorHandle', message => {
						// this.$message.error(message)
						that.hangup()
					})

					that.fastwhalecall.on('networkMonitoring', message => {
						console.log('networkMonitoring', message)
					})

				}
			},
			// 判断用户是否响铃
			getRemind () {
				let that = this
				this.remindTime = setTimeout(() => {
					this.$message.error('该号码被连续多次呼叫，请等待一段时间再次尝试。')
					this.showCall = false
					this.isShrink = false
					this.fastwhalecall.hangup()
					clearInterval(this.time);
					PubSub.publish('showCall', {
						showCall: false,
					});
				}, 10000)
			},
			async checkCallState () {
				this.currentText = '通话中'
				this.startTimer()
			},
			startTimer () {
				this.seconds += 1;
				if (this.seconds >= 60) {
					this.seconds = 0;
					this.minutes = this.minutes + 1;
				}
				if (this.minutes >= 60) {
					this.minutes = 0;
					this.hour = this.hour + 1;
				}
				this.current = (this.minutes < 10 ? '0' + this.minutes : this.minutes) + ':' + (this.seconds < 10 ? '0' + this.seconds : this.seconds);
			},
			hangup () {
				this.fastwhalecall.hangup()
			},
			async showTip () {
				const {data: res} = await this.axios.post("dialout/get-ignore-tip", {
					ActionID: this.actionId
				});
				if (res.error != 0) {
					this.$message.error(res.error_msg)
				} else {
					if (res.data.state == 0) {
						this.showAddPhone = true
					} else {
						PubSub.publish('showCall', {
							showCall: false,
						});

					}
				}
			},
			handleShrink () {
				this.isShrink = true
			},
			handleEnlarge () {
				this.isShrink = false
			},
		},
	}
</script>

<style scoped lang="less">
	.phone_container {
		width: 470px;
		height: 38%;
		position: fixed;
		right: 0;
		top: 31%;
		left: 45%;
		z-index: 99;
		overflow: hidden;
		/*background-color: #B3D4FC;*/
		border-radius: 5px;
		border: 1px solid #E8E8E8;
		object-fit: cover;
	}

	.phone_shrink {
		right: 0;
		top: 31%;
		width: 170px;
		height: 290px;
		z-index: 999999;
		background-color: #E9E9E9;
		position: fixed;
		text-align: center;
		line-height: 50px;
		box-shadow: 0 1px 3px 0 rgba(156, 156, 156, 0.15);
	}

	.head {
		cursor: pointer;
		height: 25px;
		width: 100%;
		text-align: center;
		position: absolute; /*设置内容层绝对定位*/

		img {
			width: 15px;
			height: 15px;
			right: 0;
			margin: 5px;
			position: absolute;
			z-index: 99;
			border: 1px solid #808080
		}

	}

	.content {
		width: 100%;
		height: 80%;
		top: 25px;
		text-align: center;
		position: absolute; /*设置内容层绝对定位*/
		z-index: 9999;
		color: #FFF;
		font-size: 15px;
		line-height: 50px;
	}

	.banner-bg {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border-radius: 5px;
		-webkit-transition: filter 0.3s linear;
		transition: filter 0.3s linear;
		filter: blur(13px);
		background-repeat: no-repeat;
		transform: scale(1.2);
	}


</style>
