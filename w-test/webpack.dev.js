const merge = require('webpack-merge')
const common = require('./webpack.config.js')
const webpack = require('webpack')

module.exports = merge(common, {
    mode: 'development',
    // devtool: 'inline-source-map',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: './dist',
        host: 'localhost',      // 默认是localhost
        port: 3001,             // 端口
        open: true,             // 自动打开浏览器
        hot: true,
        inline:true//实时刷新
    },
    plugins: [
        new webpack.NamedModulesPlugin(),//好像是给生成的js文件起名的吧
        new webpack.HotModuleReplacementPlugin(),//热更新？？
    ],
    output: {
        publicPath: '/'
    }
})
