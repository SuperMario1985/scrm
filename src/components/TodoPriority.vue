<template>
	<div>
		<span v-show="record.type == 0">--</span>
		<span v-show="record.type==1">所有项目必须完成，才能更改客户状态</span>
		<span v-show="record.type==2">
			<span v-show="record.project_one && record.project_one.length>0 && record.way.indexOf(1) > -1">
				<span v-for="a in record.project_one">
					【{{a}}】
				</span>中至少完成{{record.num}}项，才能更改客户状态
			</span><br/>
			<span v-show="record.project_two && record.project_two.length>0 && record.way.indexOf(2) > -1">
				<span v-for="b in record.project_two">
					所有项目需完成【{{b}}】，才能更改客户状态
				</span><br/>
			</span>
		</span>
	</div>
</template>

<script>
	export default {
		name: "todoPriority",
		props: {
			record : {
				type: Object,
				default : ''
			},
		},
	}
</script>

<style scoped>

</style>