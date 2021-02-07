<template>
	<v-chart ref="mapCharts" :options="option"/>
</template>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/component/title'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/toolbox'
	import 'echarts/lib/chart/map'
	import 'echarts/map/js/china'
	export default {
		name: "MapCharts",
		components: {
			'v-chart': ECharts
		},
		props: {
			seriesData: Array,
			max: Number
		},
		watch: {
			seriesData: {
				handler(newVal, oldVal) {
					if (this.seriesData) {
						if (newVal) {
							this.option.series[0].data = newVal
							this.option = JSON.parse(JSON.stringify(this.option))
						} else {
							this.option.series[0].data = oldVal
							this.option = JSON.parse(JSON.stringify(this.option))
						}
					}
				},
				deep: true //对象内部属性的监听，关键。
			},
			max: {
				handler(newVal, oldVal) {
					if (this.max) {
						if (newVal) {
							this.option.visualMap.max = newVal
							this.option = JSON.parse(JSON.stringify(this.option))
						} else {
							this.option.visualMap.max = oldVal
							this.option = JSON.parse(JSON.stringify(this.option))
						}
					}
				},
				deep: true //对象内部属性的监听，关键。
			}
		},
		data() {
			return {
				option : {}
			}
		},
		mounted () {
			this.option = {
				tooltip: {
					formatter:function(params,ticket, callback){
						return params.name+'：'+(params.value || 0)
					}
				},
				visualMap: {
					min: 0,
					max: this.max,
					left: 'left',
					top: 'bottom',
					text: ['高','低'],
					inRange: {
						color: ['#e0ffff', '#006edd']
					},
					show:true
				},
				geo: {
					map: 'china',
					roam: false,
					zoom:1.23,
					label: {
						normal: {
							show: true,
							fontSize:'10',
							color: 'rgba(0,0,0,0.7)'
						}
					},
					itemStyle: {
						normal:{
							borderColor: 'rgba(0, 0, 0, 0.2)'
						},
						emphasis:{
							areaColor: '#F3B329',
							shadowOffsetX: 0,
							shadowOffsetY: 0,
							shadowBlur: 20,
							borderWidth: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				},
				series : [
					{
						name: '',
						type: 'map',
						geoIndex: 0,
						data:this.seriesData
					}
				]
			}
			window.addEventListener('resize', this.resizeHandle)
		},
		beforeDestroy(){
			window.removeEventListener('resize', this.resizeHandle)
		},
		methods: {
			resizeHandle () {
				this.$refs.mapCharts.resize()
			}
		}
	}
</script>

<style scoped>

</style>