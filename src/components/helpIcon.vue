<template>
	<div class="help"
	     :class="showTransition == 0 ?'help-transition': (showTransition== 1 ? 'help-transition1' : '')">
		<a :href="helpUrl" target="_blank">
			<a-icon type="question-circle" class="help-icon"/>
			<span style="float:right;">点我帮助</span>
		</a>
	</div>
</template>

<script>
	export default {
		name   : "helpIcon",
		props  : {
			helpUrl: {
				type   : String,
				default: "https://support.qq.com/products/104790"
			}
		},
		data () {
			return {
				showTransition: 1
			}
		},
		methods: {
			initHelp () {
				let _this = this
				setInterval(function () {
					_this.showTransition = (_this.showTransition + 1) % 5
				}, 1000)
			},
		},
		created () {
			this.initHelp()
		},
		watch  : {
			helpUrl (newValue, oldValue) {
				if (this.helpUrl != newValue) {
					this.helpUrl = newValue
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.help {
		/*float: left;*/
		display: inline-block;
		margin-left: 5px;

		a {
			font-size: 14px;

			&:link {
				color: #01b065;
				text-decoration: none;
			}

			//未访问：蓝色、无下划线
			&:visited {
				color: #01b065;
				text-decoration: none;
			}
		}
	}

	.help-icon {
		margin-right: 5px;
		font-size: 14px;
		margin-top: 4px;
	}

	.help-transition {
		animation: help 1s infinite;
	}

	//已访问：紫色、无下划线
	.help-transition1 {
		animation: help1 1s infinite;
	}

	@keyframes help {
		0% {
			transform: translate(0px, 0px);
		}
		50% {
			transform: translate(0px, -8px);
		}
		100% {
			transform: translate(0px, 3px);
		}
	}

	@keyframes help1 {
		0% {
			transform: translate(0px, 3px);
		}
		50% {
			transform: translate(0px, -4px);
		}
		100% {
			transform: translate(0px, 0px);
		}
	}
</style>