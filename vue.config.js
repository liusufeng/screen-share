// vue.config.js

const BASE_URL = 'http://10.1.6.78:8888'

module.exports = {
    publicPath: './',
	outputDir: 'dist', // 构建文件的目录
	assetsDir: 'static', // 静态资源目录
    lintOnSave: false, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
    runtimeCompiler: false, // 使用运行时编译器的 Vue 构建版本,减少包的体积
    productionSourceMap: false, // 是否开启生产环境sourceMap
    devServer: {
        port: 9999,
        proxy: {
            '/api': {
                target: BASE_URL,
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                	'^/api': '/'
                }
            },
        }
    },
    css: {
        loaderOptions: {
            sass: {
                // 这里的选项会传递给 sass-loader
                prependData: `@import "@/assets/styles/varibles.scss";` //引入全局变量
            }
        }
    },
    configureWebpack: config => {
        
    },
    chainWebpack: config => {
        
    }
}
