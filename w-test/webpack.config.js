const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    entry: {
        index: './src/pages/index/index.js',
        project: './src/pages/project/project.js',
    },
    plugins: [
        new CleanWebpackPlugin(),//清除dist目录多余文件
        new HtmlWebpackPlugin({//生成index.html并自动导入js文件
            title: 'index',
            filename: 'index.html',
            template: './src/pages/index/index.html',
            chunks: ['index'],
            minify: true
        }),
        new HtmlWebpackPlugin({
            title: 'project',
            filename: "project.html",
            template: './src/pages/project/project.html',
            chunks: ['project'],
            minify: true
        }),

    ],
    output: {
        filename: './js/[name].[hash].js',//生成的js文件名
        chunkFilename: './js/[name].bundle.js',//懒加载导入的文件名
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/,
            },
            //之所以注释掉这个配置。是因为和html里面的require语法冲突，在这里配置了，html的语法就不生效了。
            //如果配置了这个的话，在js里面可以直接导入html文件。现在只能用require语法来搞了
            // {
            //     test: /\.(htm|html)$/,
            //     use: [
            //         'raw-loader',//如果不处理图片的话，用这个也可以
            //         // {
            //         //     loader: 'html-loader',
            //         //     options: {
            //         //         attrs: ['img:src', 'img:data-src', 'audio:src'],
            //         //     }
            //         // }
            //     ],
            //     include: path.join(__dirname, 'src'),
            //     exclude: /node_modules/,
            // },
            {
                test: /\.(png|svg|jpg|gif)$/, use: [{
                    loader: 'url-loader',
                    // options: {
                    //     name: '[name].[ext]',
                    //     publicPath: "./images/",
                    //     outputPath: "images/"
                    // }
                    options: {
                        limit: 8192,//限制打包图片的大小：
                        //如果大于或等于8192Byte，则按照相应的文件名和路径打包图片；如果小于8192Byte，则将图片转成base64格式的字符串。
                        name: 'images/[name].[ext]',//images:图片打包的文件夹；
                        //[name].[ext]：设定图片按照本来的文件名和扩展名打包，不用进行额外编码
                    }
                }]
            },
            {
                //注意还要装@babel/runtime。不然报错
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                include: path.join(__dirname, 'src'),
                use: ['babel-loader']
            }
        ]
    },
}
