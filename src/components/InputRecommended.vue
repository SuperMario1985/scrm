<template>
	<div class="input-box">
		<a-tag v-for="(item,index) in msgList" style="height: 22px;margin: 5px 5px 5px 0;">{{item}}
			<a-icon type="close" @click="delTag(index)"/>
		</a-tag>
		<a-input :placeholder="placeholder" :disabled="msg.length == keyLength" class="input-area" v-model="msgTitle" @pressEnter="onSearch"
		         :maxLength="maxLength"
		         @change="onChange"/>
	</div>
</template>

<script>
	export default {
		name   : "inputRecommended",
		props  : {
			msg        : {
				type   : Array,
				default: []
			},
			placeholder: {
				type   : String,
				default: ""
			},
			maxLength  : {
				type   : Number,
				default: 10
			},
			keyLength  : {
				type : Number,
				default : -1,
			},
		},
		watch  : {
			msg (newValue) {
				this.msgList = newValue
			}
		},
		data () {
			return {
				msgTitle: '',//输入框内容
				msgList : [],//列表
			}
		},
		methods: {
			onChange (e) {
				this.$emit('func', this.msgList, this.msgTitle.trim())
			},
			onSearch (e) {
				if (e.target.value.trim() != '') {
					if (this.msgList.indexOf(e.target.value.trim()) == -1) {
						this.msgList.push(e.target.value.trim())
						this.msgTitle = ''
						this.$emit('func', this.msgList, this.msgTitle)
					} else {
						this.$message.error('已有重复值，请重新输入！')
					}
				}
			},
			delTag (index) {
				this.msgList.splice(index, 1)
				this.$emit('func', this.msgList)
			},
		}
	}
</script>

<style lang="less" scoped>
	.input-box {
		background: #FFF;
		padding: 0 10px;
		border: 1px solid #CCC;
		display: flex;
		flex-wrap: wrap;
	}

	.input-area {
		min-width: 200px;
		flex: 1;
	}

	.ant-input:hover, .ant-input, .ant-input:focus {
		border: 0;
		box-shadow: none;
	}

	.ant-input {
		padding: 4px 0;
	}

</style>