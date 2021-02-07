<template>
	<div>
		<div class="qrcode">
			<img class="qrcode-img" src="../../../assets/archive/qrcode.png">
			<p style="width: 665px;margin-top: 20px;font-size: 16px;">企业微信会话存档，可以完整的保存员工和客户之间所有的对话，包括撤回/删除的信息，并提供自定义设置敏感词，一旦发生敏感操作，系统自动及时触发预警， 帮助商家做好企业风控。</p>
			<p style="width: 665px;font-size: 16px;font-weight: 700; color: #1890FF;">目前该功能尚在内测中，具体请扫码联系销售。</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: "List"
	}
</script>

<style scoped>
	.qrcode {
		position: absolute;
		left: 50%;
		top: 43%;
		transform: translate(-50%, -50%);
		text-align: center;
	}
	.qrcode-img {
		width: 280px;
		box-shadow: 0 0 12px rgba(0, 0, 0, 0.3) ;
	}
</style>