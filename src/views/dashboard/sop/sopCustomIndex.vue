<template>
	<div  class='h-full'>
		<sopList :is_chat = '0' :type.sync='type'></sopList>
	</div>
</template>

<script>
	import sopList from './sopList'
    export default {
        name: "sopCustomIndex",
	    components: {sopList},
	    data(){
            return {
                type: 1, // SOP类型：1新客培育、2客户生命周期
            }
	    },
	    mounted() {
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if (!vm.$test.empty(from.query) && /addRules/.test(from.path)) {
                    vm.type = from.query.type || 1
                } else {
                    vm.type = 1
                }
            })
        },
    }
</script>

<style scoped>

</style>
