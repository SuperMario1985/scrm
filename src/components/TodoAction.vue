<template>
		<div v-if="typeof has == 'string'" style="display: inline-block;">
			<a-button :type="type" v-if="has.length > 0" style="margin:5px 5px 0;" @click="callFather" :v-has="has">{{buttonText}}</a-button>
			<a-button :type="type" v-else style="margin:5px 5px 0;" @click="callFather">{{buttonText}}</a-button>
		</div>
		<div v-else>
			<template v-for="(hasItem, index) in has">
				<div style="display: inline-block;">
					<a-button :type="typeof type == 'string' ? type : (typeof type[index] != 'undefined'? type[index] : '')" v-if="hasItem.length > 0" style="margin:5px 5px 0;" @click="callFather(index)" :v-has="hasItem">{{buttonText[index]}}</a-button>
					<a-button :type="typeof type == 'string' ? type : (typeof type[index] != 'undefined'? type[index] : '')" v-else style="margin:5px 5px 0;" @click="callFather(index)">{{buttonText[index]}}</a-button>
				</div>
			</template>
		</div>
</template>

<script>
	export default {
		name: "todoAction",
		props: {
			type : {
				type: String|Array,
				default : ''
			},
			has: {
				type: String|Array,
				default: '',
			},
			buttonText: {
				type: String|Array,
				default: 'Todo Action'
			},
			callback: {
				type: Function|Array,
				default: () => {}
			},
			record: {
				type: Object,
				default: {}
			},
			index: {
				type: Number,
				default: 0
			},
		},
		methods:{
			callFather (index = 0) {
				console.log(this.callback, this.record, this.index)
				let doCallback = this.callback
				if (typeof this.callback != "function") {
					doCallback = this.callback[index]
				}

				doCallback(this.record, this.index)
			}
		}
	}
</script>

<style scoped>

</style>