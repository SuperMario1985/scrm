const CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
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
	},
	devServer: {
			overlay: {
					warnings: false,
					errors: false
			}
	},
	css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#fff',// 全局主色
            'link-color': '#1DA57A',// 链接色
						'border-radius-base': '2px',// 组件/浮层圆角
						'btn-primary-bg':'#fff'
          },
          javascriptEnabled: true,
        },
      },
    },
  },
}