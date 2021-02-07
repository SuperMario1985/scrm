<template>
	<v-chart ref="pieCharts" :options="option"/>
</template>

<script>
	import ECharts from 'vue-echarts'
	import 'echarts/lib/component/title'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/toolbox'
	import 'echarts/lib/chart/pie'

	export default {
		name      : "PieCharts",
		components: {
			'v-chart': ECharts
		},
		props: {
			options: Object
			// title: String,
			// formatter: String,
			// seriesData: Array
		},
		watch: {
			options: {
				handler(newVal, oldVal) {
					if (this.options) {
						if (newVal) {
							this.option = this.getOptions(newVal)
						} else {
							this.option = this.getOptions(oldVal)
						}
					}
				},
				deep: true //对象内部属性的监听，关键。
			}
		},
		data () {
			return {
				polar: {
					title: {
						text: '',
						left: 'left',
						top: 20,
						textStyle: {
							fontFamily: 'PingFangSC-Medium',
							color: '#1a1a1a',
							fontSize: '18px'
						}
					},
					// 设置饼图的颜色
					// color: ['#e7bcf3', '#feb633', '#fb821e', '#8f12fd', '#5086ee', '#56be6e', '#e16f8b',   ],
					// color: ['#37a2da', '#32c5e9','#9fe6b8','#ffdb5c','#ff9f7f','#fb7293','#e7bcf3'],
					color: ['#3c92ff','#fa78af', '#ff7c44', '#939bf2', '#7ecef4', '#13db9f', '#74e551', '#08d1f5'],
					series:
						{
							name: "访问来源",
							type:'pie',
							radius: ['40%', '55%'],
							// minAngle: 10,
							avoidLabelOverlap: true,
							label: {
								normal: {
									textStyle: {

									},
									formatter: ''
								},

							},
							labelLine: {
								normal: {
									show: true
								}
							},
							data:[],
						}
				},
				option: {}
			}
		},
		mounted () {
			this.option = this.getOptions(this.options)
			window.addEventListener('resize', this.resizeHandle)
		},
		beforeDestroy(){
			window.removeEventListener('resize', this.resizeHandle)
		},
		methods: {
			resizeHandle () {
				this.$refs.pieCharts.resize()
			},
			getOptions(options) {
				this.polar.title.text = options.title || ""
				this.polar.series.label.normal.formatter = options.formatter || ""
				this.polar.series.data = options.seriesData
				return JSON.parse(JSON.stringify(this.polar))
			}
		}
	}
</script>

<style lang='less' scoped>
	.echarts {
		width: 100%;
		height: 300px;
		margin: 0 auto;
		/deep/ div:first-child {
			width: 100% !important;
			/deep/ canvas {
				/*margin: 0 auto;*/
				width: 100% !important;
				/*left: 50% !important;*/
				/*transform: translateX(-50%) !important;*/
			}
		}
	}
</style>