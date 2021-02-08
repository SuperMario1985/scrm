const CompressionPlugin = require("compression-webpack-plugin")
const IS_PROD = ['production', 'test'].includes(process.env.NODE_ENV)

module.exports = {
	assetsDir: 'assets',
	productionSourceMap: false,
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
        extract: IS_PROD,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
        },
        // 启用 CSS modules for all css / pre-processor files.
        modules: false,
	},
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			return {
				plugins: [new CompressionPlugin({
					test: /\.js$|\.html$|\.css/,    // 匹配文件名称
					threshold: 10240,   // 大小限制，对于超过10KB的数据进行压缩处理
					deleteOriginalAssets: false,    // 保留删除源文件
				})]
			}
		}
	},
	devServer: {
		// overlay: {
		//   warnings: true,
		//   errors: true
		// },
		host: 'localhost',
		hot: true,
		port: 8080,
		https: false,
		hotOnly: false,
		proxy: {
			'/api': {
				target: 'https://hd-scrm.wemero.cn',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^api': '/api'
				}
			},
		}
	}
}