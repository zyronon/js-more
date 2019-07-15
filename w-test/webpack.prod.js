const merge = require('webpack-merge')
const common = require('./webpack.config.js')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: './css/[name].[hash].css',
            chunkFilename: './css/[id].[hash].css',
        }),
    ],
    output: {
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    //提取css到单个文件
                    MiniCssExtractPlugin.loader,//热更新功能不行。
                    'css-loader',
                    'sass-loader'
                ],
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/,
            },
        ]
    }
})
