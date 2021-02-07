<template>
	<v-chart ref="barCharts" :options="option"></v-chart>
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
			options: Object
		},
		watch     : {
			options: {
				handler (newVal, oldVal) {
					if (this.options) {
						if (newVal) {
							this.option.title.text = newVal.title
							this.option.xAxis[0].data = newVal.xAxisData
							this.option.series[0].data = newVal.seriesData
							this.option.series[0].name = newVal.name
							if(newVal.data_Type == 1){
								this.option.color[0] = '#3398DB'
							}else if(newVal.data_Type == 2){
								this.option.color[0] = '#ad85f4'
							}else if(newVal.data_Type == 3){
								this.option.color[0] = '#ffc71b'
							}else if(newVal.data_Type == 4){
								this.option.color[0] = '#fa78af'
							}
							this.$refs.barCharts.resize()
						} else {
							this.option.title.text = oldVal.title
							this.option.xAxis[0].data = oldVal.xAxisData
							this.option.series[0].data = oldVal.seriesData
							this.option.series[0].name = oldVal.name
							if(oldVal.data_Type == 1){
								this.option.color[0] = '#3398DB'
							}else if(oldVal.data_Type == 2){
								this.option.color[0] = '#ad85f4'
							}else if(oldVal.data_Type == 3){
								this.option.color[0] = '#ffc71b'
							} else if(oldVal.data_Type == 4){
								this.option.color[0] = '#fa78af'
							}
							this.$refs.barCharts.resize()
						}
					}
				},
				deep: true //对象内部属性的监听，关键。
			},
		},
		components: {
			'v-chart': ECharts
		},
		data () {
			return {
				option: {
					title: {
						text: '折线图堆叠',
						left     : 'left',
						textStyle: {
							fontFamily: 'PingFangSC-Medium',
							color     : '#1A1A1A',
							fontSize  : '18px'
						}
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					color: ['#3398DB'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {            // 坐标轴指示器，坐标轴触发有效
							type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [
						{
							type: 'category',
							data: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
							axisTick: {
								alignWithLabel: true
							}
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: '次数',
							type: 'bar',
							barWidth: '60%',
							data: ['50','100','150','200','250','200','150','100','50','100'],
							// itemStyle: {
							// 	//通常情况下：
							// 	normal: {
							// 		//每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
							// 		// color: '#50d166'
							// 		color: function (params) {
							// 			let colorList = ['#FF5235', '#D7DFD8', '#2ECAAE', '#23D4F7', '#AD85F4', '#FA78AF', '#1FADFF', '#38D8A0', '#FF9F16', '#0679FD',]
							// 			return colorList[params.dataIndex]
							// 		}
							// 	},
							// },
						}
					]
				}
			}
		},
		mounted () {
			this.option.title.text = this.options.title
			this.option.xAxis[0].data = this.options.xAxisData
			this.option.series[0].data = this.options.seriesData
			if(this.options.data_Type == 1){
				this.option.color[0] = '#3398DB'
				this.option.series[0].name = '发起申请数'
			}else if(this.options.data_Type == 2){
				this.option.color[0] = '#ad85f4'
				this.option.series[0].name = '新增客户数'
			}else if(this.options.data_Type == 3){
				this.option.color[0] = '#ffc71b'
				this.option.series[0].name = '被客户删除/拉黑人数'
			}
			this.$refs.barCharts.resize()
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