<template>
	<v-chart ref="radarCharts" :options="option"></v-chart>
</template>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/component/title'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/toolbox'
	import 'echarts/lib/component/polar'
	import 'echarts/lib/chart/radar'
	export default {
		name: "RadarCharts",
		props     : {
			options: Object,  // 配置项
		},
		watch     : {
			options: {
				handler (newVal, oldVal) {
					if (this.options) {
						if (newVal) {
							this.option = this.getOptions(newVal)
							this.$refs.radarCharts.resize()
						} else {
							this.option = this.getOptions(oldVal)
							this.$refs.radarCharts.resize()
						}
					}
				},
				deep: true //对象内部属性的监听，关键。
			}
		},
		components: {
			'v-chart': ECharts
		},
		data(){
			return {
				option: {
					title: {
						text: '多雷达图',
						left: 'left',
						show: false,
						textStyle: {
							fontFamily: 'PingFangSC-Medium',
							color: '#1A1A1A',
							fontSize: '18px'
						}
					},
					toolbox: {//工具栏
						show: false,
						feature: {
							saveAsImage: {}
						}
					},
					color: ['#ee6666'],
					tooltip: {//提示框
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						left: 'center',
						data: ['某软件'],
						show: false
					},
					radar: [
						{
							indicator: [
								{text: '额度', max: 100},
								{text: '进度', max: 100},
								{text: '频率', max: 100}
							],
							center: ['35%', '50%'],
							radius: 120
						},
					],
					series: [
						{
							type: 'radar',
							tooltip: {
								trigger: 'item'
							},
							areaStyle: {},
							data: [
								{
									value: [30, 73, 150],
									name: '某软件'
								}
							]
						}
					]
				}
			}
		},
		mounted() {
			// this.option.title.text = this.options.title
			this.option.radar[0].indicator = this.options.indicator
			this.option.series[0].data[0].value = this.options.seriesData
			this.option.series[0].data[0].name = this.options.name
			
			this.$refs.radarCharts.resize()
			window.addEventListener('resize', this.resizeHandle)
		},
		beforeDestroy(){
			window.removeEventListener('resize', this.resizeHandle)
		},
		methods: {
			resizeHandle () {
				this.$refs.radarCharts.resize()
			}
		}
	}
	
</script>

<style>
</style>
