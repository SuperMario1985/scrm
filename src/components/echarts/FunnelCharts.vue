<template>
	<v-chart ref="funnelCharts" :options="option"/>
</template>

<style lang='less' scoped>
	.echarts {
		min-height: 470px;
		z-index: 9999;
	}
</style>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/component/title'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/toolbox'
	import 'echarts/lib/chart/funnel'
	import 'echarts/lib/component/polar'

	export default {
		props     : {
			options: Object,  // 配置项
		},
		watch     : {
			options: {
				handler (newVal, oldVal) {
					if (this.options) {
						if (newVal) {
							this.option = this.getOptions(newVal)
							this.$refs.funnelCharts.resize()
						} else {
							this.option = this.getOptions(oldVal)
							this.$refs.funnelCharts.resize()
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
					title: {
						text: '',
						subtext: '',
						textStyle: {
							fontFamily: 'PingFangSC-Medium',
							color     : '#1A1A1A',
							fontSize  : '18px'
						}
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c}%"
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					legend: [],

					series: [
						{
							name:'',
							type:'funnel',
							left: '10%',
							top: 60,
							bottom: 60,
							width: '80%',
							min: 0,
							max: 100,
							minSize: '',
							maxSize: '100%',
							sort: 'none',
							gap: 2,
							label: {
								show: true,
								position: 'inside'
							},
							labelLine: {
								length: 10,
								lineStyle: {
									width: 1,
									type: 'solid'
								}
							},
							itemStyle: {
								borderColor: '#fff',
								borderWidth: 1
							},
							emphasis: {
								label: {
									fontSize: 20
								}
							},
							data: []
						}
					]
				},
				option: {},
				color : ['#1fadff', '#ffc71b', '#ad85f4', '#fa78af', '#21f1ad', '#51bd62', '#d7dfd8', '#ff5235']
			}
		},
		mounted () {
			let that = this
			this.polar.color = this.color
			that.option = that.getOptions(that.options)
			this.$refs.funnelCharts.resize()
			window.addEventListener('resize', this.resizeHandle)
		},
		beforeDestroy(){
			window.removeEventListener('resize', this.resizeHandle)
		},
		methods: {
			resizeHandle () {
				this.$refs.funnelCharts.resize()
			},
			getOptions(options) {
				let that = this
				let p = JSON.parse(JSON.stringify(this.polar))
				p.title.text = this.options.title;
				if (options.legendData) {
					let legend = []
					let data = []
					for(let i = 0; i < options.legendData.length; i++) {
						data.push(options.legendData[i])
						if((i != 0 && (i+1) % 10 == 0) || i == options.legendData.length - 1) {
							legend.push( {x:'center',top: parseInt((i/10).toString()) * 25,data: JSON.parse(JSON.stringify(data)) })
							data = []
						}
					}
					p["legend"] = JSON.parse(JSON.stringify(legend));
				}
				for (let i = 0; i < this.options.seriesData.length; i++) {
					p.series[i].minSize = this.options.seriesData[i].minSize
					p.series[i].name = this.options.seriesData[i].name
					p.series[i].data = this.options.seriesData[i].data
				}
				return JSON.parse(JSON.stringify(p))
			}
		}
	}
</script>