<template>
	<div>
		<div class="w-40 h-40 flex items-center justify-center flex-wrap ss-imgs-box br2 pl-1 pt-1">
			<div :class="'flex-w' + imgs.length" class='pr-1 pb-1' v-for="(item, index ) in imgs" :key="index">
				<img :src="item" class="w-full block" />
			</div>
		</div>
	</div>
</template>

<script>
    export default {
        name: "chatImgs",
        props  : {
            imgs: {
                type: Array,
                default () {
                    return {}
                }
            }
        },
    }
</script>

<style scoped>
	.ss-imgs-box{background: #efefef; align-content: center }
	.flex-w1{flex: 0 0 100%;}
	.flex-w2,.flex-w3,.flex-w4{flex: 0 0 50%;}
	.flex-w5,.flex-w6,.flex-w7,.flex-w8,.flex-w9{flex: 0 0 33.3%;}
</style>
