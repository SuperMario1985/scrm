<template>
	<img :src="emojiUrl" :alt="alt" :height="eh" :width="ew"/>
</template>

<script>
	import WEmoji from "../common/js/wechatEmoji.js";

	export default {
		name   : "wechatEmoji",
		props  : {
			alt: {
				type   : String,
				default: null,
			},
			ew : {
				type   : Number,
				default: 48,
			},
			eh : {
				type   : Number,
				default: 48,
			}
		},
		data () {
			return {
				emojiUrl: ''
			}
		},
		methods: {
			getEmojiUrl () {
				this.emojiUrl = WEmoji.getEmojiUrl(this.alt);
			}
		},
		created () {
			this.getEmojiUrl();
		}
	}
</script>

<style scoped>

</style>