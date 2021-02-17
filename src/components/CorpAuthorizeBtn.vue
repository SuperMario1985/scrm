<template>
	<div v-show="need" style="width: 100%;padding: 100px;">
		<img src="../assets/authorize.png" alt="" class="authorize">
		<div style="color: #666666;text-align: center;margin: 40px 0 32px;">尚未授权已认证的企业微信/公众号，该功能无法使用～</div>
		<!-- 点击添加公众号弹窗 -->
		<corpAuthorize :show="showWxModal" @cancel="cancel"></corpAuthorize>
	</div>
</template>

<script>
	// import corpAuthorize from "@/components/CorpAuthorize.vue"
	import corpAuthorize from "@/components/AuthorizeCorp.vue"

	export default {
		components: {
			corpAuthorize
		},
		name      : "authorizeBtn",
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
				this.showWxModal = true;
			},
			cancel () {
				this.showWxModal = false
			}
		},

		watch: {},

		created () {
			if(localStorage.getItem('corpArr') == '[]'){
				this.need = true
			}
		}
	};
</script>

<style lang='less' scoped>
	.authorize {
		width: 380px;
		height: 224px;
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