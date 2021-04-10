const CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
	lintOnSave:false,
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
        port: 8080
    },
	assetsDir          : 'assets',
	productionSourceMap: false,
	css                : {
		extract: false
	},
	configureWebpack   : config => {
		if (process.env.NODE_ENV === 'production') {
			return {
				plugins: [new CompressionPlugin({
					test                : /\.js$|\.html$|\.css/,    // 匹配文件名称
					threshold           : 10240,   // 大小限制，对于超过10KB的数据进行压缩处理
					deleteOriginalAssets: false,    // 保留删除源文件
				})]
			}
		}
	}
}
