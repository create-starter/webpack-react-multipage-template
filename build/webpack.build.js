require('shelljs/global')
var ora = require('ora')
var webpack = require('webpack')
var baseConfig = require('./webpack.base')
var webpackMerge = require('webpack-merge')


console.log(
    '  Tips:\n' +
    '  Built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
)
// ora 美化终端输出 Elegant terminal spinner
var spinner = ora('building for production...')
spinner.start()

//require('shelljs/global'); 使用shelljs 的全局模式，允许直接在脚本中写 shell 命令。
//rm([options,] file [, file ...]) :Removes files.
//rm('-rf', 'dist/');
//rm('-rf', !('dist/assets/'));
rm('-rf', 'dist/{*.html,static}');

baseConfig = webpackMerge(baseConfig, {
    devtool: 'source-map',
    plugins: [
        //HashedModuleIdsPlugin。这个插件会根据模块的相对路径生成一个长度只有四位的字符串作为模块的 id，
        //既隐藏了模块的路径信息，又减少了模块 id 的长度.暂时未发现文档
        new webpack.HashedModuleIdsPlugin(),
        new webpack.BannerPlugin({banner:"created by leeson8888"})
    ]
})


webpack(baseConfig, function (err, status) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(status.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n')
})