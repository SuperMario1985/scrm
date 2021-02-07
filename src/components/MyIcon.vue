<template>
	<my-icon :type="type" :style="istyle"></my-icon>
</template>

<script>
	import {Icon} from "ant-design-vue";

	const MyIcon = Icon.createFromIconfontCN({
		scriptUrl: '//at.alicdn.com/t/font_1620472_d9k3boz8ebw.js'
	});

	export default {
		name      : "MyIcon",
		props     : {
			type  : {
				type   : String,
				default: "example"
			},
			istyle: {
				type   : String | Object,
				default: null,
			}
		},
		components: {
			'my-icon': MyIcon
		},
		watch     : {
			type (newType) {
				this.type = newType
			}
		}
	}
</script>

<style scoped>

</style>