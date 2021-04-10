<template>
	<div>
		<a-modal
				title="推送内容"
				:width='700'
				:visible="visible"
				@ok="handleOk"
				@cancel="handleCancel"
		>

			<template  slot="footer">
				<a-button @click="handleOk">关闭</a-button>
			</template >
			<div class="px-30 ss-min-h500">
				<rulesPay  :rules="timeData" ></rulesPay>
			</div>
		</a-modal>

		<div @click='visible = true'>
			<slot></slot>
		</div>

	</div>
</template>

<script>
    import rulesPay  from './rulesPay'
    export default {
        name: "detailDrawer",
        components: {rulesPay},
        props: {
            timeData: {
                type: Array,
	            default(){
                    return []
	            }
            }
        },
        data() {
            return {visible: false,}
        },
        watch: {
            timeData: {
                handler(v) {
                },
                immediate: true
            }
        },
        methods: {
            handleOk(e) {
                this.visible = false;
            },
            handleCancel(e) {
                this.visible = false;
            },
        },
    }
</script>

<style scoped>
	.ss-min-h500{min-height: 500px}
</style>
