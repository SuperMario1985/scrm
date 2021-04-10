<template>
	<div class='h-full'>
		<sopList :is_chat = '1' :type.sync='type'></sopList>
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
    }
</script>

<style scoped>

</style>
