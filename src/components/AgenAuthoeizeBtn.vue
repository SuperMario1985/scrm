<template>
	<div v-show="need" style="width: 100%;padding: 100px;">
		<img src="../assets/agentAuthorize.png" alt="" class="authorize">
		<a-button type="primary" class="btn" @click="addAccount">立即添加</a-button>
	</div>
</template>

<script>
	import corpAuthorize from "@/components/CorpAuthorize.vue"

	export default {
		components: {
			corpAuthorize
		},
		name      : "agentAuthorizeBtn",
		props     : {},
		data () {
			return {
				showWxModal: false, //添加公众号对话框的显示与隐藏
				need:false
			};
		},
		methods   : {
			//点击添加公众号
			addAccount () {
				this.$router.push('/agent/list')
			}
		},

		watch: {},

		created () {
			let agentCount = '0'
			if(JSON.parse(localStorage.getItem("corpArr")).length > 0) {
				agentCount = JSON.parse(localStorage.getItem("corpArr")).find((corp) => corp.corpid == localStorage.getItem('corpId')).agent_count
			} else {
				agentCount = '0'
			}
			if(agentCount == 0){
				this.need = true
			}
		}
	};
</script>

<style lang='less' scoped>
	.authorize {
		width: 283px;
		height: 230px;
		display: block;
		margin: auto;
	}

	.btn {
		width: 200px;
		height: 40px;
		font-size: 14px;
		display: block;
		margin: 20px auto 0;
	}
</style>