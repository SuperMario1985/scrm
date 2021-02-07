<template>
	<v-chart ref="barCharts" :options="option" :class="width > 0 ? 'chart-style' : '' "></v-chart>
</template>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/component/title'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/toolbox'
	import 'echarts/lib/chart/bar'

	export default {
		name      : "BarCharts",
		props     : {
			options: Object,
			width : {
				type: Number,
				default : 0
			}
		},
		watch     : {
			options: {
				handler (newVal, oldVal) {
					if (this.options) {
						if (newVal) {
							this.polar.yAxis.data = newVal.yAxisData
							this.polar.series.data = newVal.seriesData
							this.option = this.polar
						} else {
							this.polar.yAxis.data = oldVal.yAxisData
							this.polar.series.data = oldVal.seriesData
							this.option = this.polar
						}
					}
				},
				deep: true //对象内部属性的监听，关键。
			},
			width : {
				handler (newVal, oldVal) {
					if (newVal != oldVal) {
						if (newVal != 0) {
							document.getElementsByClassName('chart-style')[0].getElementsByTagName('cavans')[0].style.width = newVal
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
				option: {},
				polar : {
					grid : {
						left        : '3%',
						right       : '4%',
						bottom      : '3%',
						width       : '85%',
						containLabel: true
					},
					xAxis: {
						show: false,
						type: 'value',
					},

					yAxis : {
						axisTick: {
							show: false
						},
						axisLine: {
							show: false,
						},
						type    : 'category',
						data    : []
					},
					color : ["#2F4554", "#C23531", "#61A0A8", "#D48265", "#91C7AE", "#749F83", "#CA8622", "#BDA29A", "#6E7074", "#546570"],
					// color : ["#F3F3F3", "#C23531", "#61A0A8", "#D48265", "#91C7AE", "#749F83", "#CA8622", "#BDA29A", "#6E7074", "#546570"],
					series:
						{
							type     : 'bar',
							barWidth : 20,
							label    : {
								normal: {
									show     : true,
									position : 'right',
									formatter: '{c}%'
								}
							},
							data     : [],
							itemStyle: {
								//通常情况下：
								normal: {
									//每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
									// color: '#50d166'
									color: function (params) {
										let colorList = ['#FF5235', '#D7DFD8', '#2ECAAE', '#23D4F7', '#AD85F4', '#FA78AF', '#1FADFF', '#38D8A0', '#FF9F16', '#0679FD',]
										return colorList[params.dataIndex]
									}
								},
							},
							//鼠标悬停时：
							emphasis : {
								shadowBlur   : 10,
								shadowOffsetX: 0,
								shadowColor  : 'rgba(0, 0, 0, 0.5)'
							}

						}

				}
			}
		},
		mounted () {
			this.polar.yAxis.data = this.options.yAxisData
			this.polar.series.data = this.options.seriesData
			this.option = this.polar
			window.addEventListener('resize', this.resizeHandle)
		},
		beforeDestroy(){
			window.removeEventListener('resize', this.resizeHandle)
		},
		methods: {
			resizeHandle () {
				this.$refs.barCharts.resize()
			}
		}
	}
</script>

<style scoped>

</style>