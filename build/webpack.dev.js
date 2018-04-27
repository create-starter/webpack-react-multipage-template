var express = require('express');
var config = require('../config/index.js');
var path = require('path');
var opn = require('opn');
var webpack = require('webpack'); //es5
//import webpack from "webpack"; //es6
var webpackMerge = require('webpack-merge');


var history = require('connect-history-api-fallback');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');


//https://github.com/chimurai/http-proxy-middleware
//webpack-dev-servere自带的反向代理一直无法成功,只好单独配置
var proxy = require('http-proxy-middleware'); 


// ["webpack-hot-middleware/client?reload=true", "./src/index.js"]
// unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度,修改原数组，但是不创建新的数组。
// baseConfig.entry.index.unshift('webpack-hot-middleware/client?reload=true')
var baseConfig = require('./webpack.base');
baseConfig = webpackMerge(baseConfig, {
    plugins: [
        // HotModule 插件在页面进行变更的时候只会重绘对应的页面模块，不会重绘整个 html 文件
        // 全局启用热模块更换，也称为HMR。HMR应该永远不会在生产中使用。
        new webpack.HotModuleReplacementPlugin(),
    ],
    //https://doc.webpack-china.org/configuration/dev-server/#devserver-historyapifallback
    devServer: {
        //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
        historyApiFallback: {
            //当路径中使用点(dot)（常见于 Angular），你可能需要使用 disableDotRule：
            disableDotRule: true
        },    
        // publicPath is required, whereas all other options are optional
        publicPath: '/',
        //contentBase: path.join(__dirname + '../dist/'),
        hot: true,
        //inline:true,//默认true
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false 
        }
        /* webpack-dev-servere自带的反向代理一直无法成功，原因未知
        proxy: {}
        */
    }
})


var port = config.port;

var app = express();

//反向代理中间件
app.use(config.proxy.baseUrl, proxy(config.proxy.options));

//将生产的dist 作为静态服务器
app.use('/dist', express.static('dist'));

//https://doc.webpack-china.org/api/node/
//webpack 函数需要传入一个 webpack 配置对象，当同时传入回调函数时就会执行 webpack compiler
//如果不传入回调函数到 webpack 执行函数中，就会得到一个 webpack Compiler 实例
var compiler = webpack(baseConfig);
var webpackMiddlewareInstance = webpackMiddleware(compiler,baseConfig.devServer);
var webpackHotMiddlewareInstance = webpackHotMiddleware(compiler,{
     heartbeat: 2000
});

app.use(webpackMiddlewareInstance);
app.use(webpackHotMiddlewareInstance);

app.use(express.static(path.join(__dirname, '../dist/')));

//express的中间件,防止单页面使用history模式后，刷新页面出现404，开发环境
app.use(history());

app.listen(port, function onStart(err) {
    var uri = 'http://localhost:' + port + '/index.html';
    if (err) {
        console.log(err);
    }else {
        console.log(uri);
    }
    opn(uri);
})