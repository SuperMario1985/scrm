<template>
	<v-chart ref="lineCharts" :options="option"/>
</template>

<style lang='less' scoped>
	.echarts {
		width: 100%;
		min-height: 470px;
		z-index: 9999;

		/deep/ div:first-child {
			width: 100% !important;
			/deep/ canvas {
				width: 100% !important;
				left: 50% !important;
				transform: translateX(-50%) !important;
			}
		}
	}
</style>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/component/title'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/toolbox'
	import 'echarts/lib/chart/line'
	import 'echarts/lib/component/polar'

	export default {
		props     : {
			options: Object
		},
		watch     : {
			options: {
				handler (newVal, oldVal) {
					if (this.options) {
						if (newVal) {
							this.option = this.getOptions(newVal)
							if(newVal.groupIndex == 1){
								this.option.color[0] = '#3398DB'
							}else if(newVal.groupIndex == 2){
								this.option.color[0] = '#3398DB'
							}else if(newVal.groupIndex == 3){
								this.option.color[0] = '#3398DB'
							}else if(newVal.groupIndex == 4){
								this.option.color[0] = '#01B065'
								this.option.series[0].itemStyle.normal.lineStyle.color="#01B065"
							}
							this.$refs.lineCharts.resize()
						} else {
							this.option = this.getOptions(oldVal)
							if(oldVal.groupIndex == 1){
								this.option.color[0] = '#3398DB'
							}else if(oldVal.groupIndex == 2){
								this.option.color[0] = '#3398DB'
							}else if(oldVal.groupIndex == 3){
								this.option.color[0] = '#3398DB'
							}
							this.$refs.lineCharts.resize()
						}
					}
				},
				deep: true //对象内部属性的监听，关键。
			}
		},
		components: {
			'v-chart': ECharts
		},
		data () {
			return {
				polar : {
					title  : {
						text     : '',
						left     : 'left',
						textStyle: {
							fontFamily: 'PingFangSC-Medium',
							color     : '#1A1A1A',
							fontSize  : '18px'
						}
					},
					tooltip: {
						trigger: 'axis'
					},
					color : [],
					legend: {
						data: []
					},
					grid   : {
						left        : '3%',
						right       : '4%',
						bottom      : '3%',
						width       : 'auto',
						containLabel: true
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					xAxis  : {
						type       : 'category',
						boundaryGap: false,
						data       : []
					},
					yAxis  : {
						type: 'value'
					},
					series : []
				},
				option: {},
				// color : ['#1fadff', '#4b85ff', '#ad85f4', '#fa78af', '#21f1ad', '#51bd62', '#d7dfd8', '#ff5235']
				color : ['#1fadff', '#ffc71b', '#ad85f4', '#fa78af', '#21f1ad', '#51bd62', '#d7dfd8', '#ff5235']
			}
		},
		mounted () {
			let that = this
			this.polar.color = this.color
			if(that.options.data_Type == 1){
				this.polar.toolbox.feature.saveAsImage.show = false
				this.polar.title.show = false
				this.polar.tooltip.show = false
				this.polar.grid.show = false
				this.polar.xAxis.show = false
				this.polar.yAxis.show = false
			}
			that.option = that.getOptions(that.options)
			this.$refs.lineCharts.resize()
			window.addEventListener('resize', this.resizeHandle)
		},
		beforeDestroy(){
			window.removeEventListener('resize', this.resizeHandle)
		},
		methods: {
			resizeHandle () {
				this.$refs.lineCharts.resize()
			},
			getOptions(options) {
				let that = this
				let p = JSON.parse(JSON.stringify(this.polar))
				p.title.text = this.options.title;
				if (options.legendData) {
					let legend = {
						data: that.options.legendData
					}
					p["legend"] = JSON.parse(JSON.stringify(legend));
				}
				p.xAxis.data = options.xAxisData;
				if(options.yAxisData){
					p.yAxis = options.yAxisData;
				}
				let itemStyle = {
					normal: {
						lineStyle: {
							color: ''
						}
					}
				}

				p.series = JSON.parse(JSON.stringify(options.seriesData))
				for (let i = 0; i < p.series.length; i++) {
					let style = JSON.parse(JSON.stringify(itemStyle))
					style.normal.lineStyle.color = this.color[i]
					p.series[i].itemStyle = JSON.parse(JSON.stringify(style))
				}
				return JSON.parse(JSON.stringify(p))
			}
		}
	}
</script>