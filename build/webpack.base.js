var webpack = require('webpack')
var glob = require('glob');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ENV = process.env.NODE_ENV;
const isDev = (ENV === 'dev') ? true : false;  //是否是开发环境
//提前css，否则css打包到js 中去了
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

console.log(path.resolve(__dirname));

const mode = isDev ? "development" : "production";

const cdn = 'http://www.itshizhan.com/pubhtml/webapp/';

// 基础配置
const baseConfig = {
	mode: mode,
	entry: {
		// 按约定生成
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		//确保 publicPath 总是以斜杠(/)开头和结尾。
		//publicPath: '/',
		publicPath: isDev ? "/" : cdn,
		filename: 'static/js/[name].[hash:6].js',  //chunkhash // prod publish
		// 开发环境
		chunkFilename: 'static/js/[name].[chunkhash:6].js'
	},
	resolve: {
		extensions: ['*', '.js', '.json'],
		alias: {
			'@src': path.resolve(__dirname, '..', './src/')
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: ['./src/assets/vender', /(node_modules)/],
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env'],
						plugins: ['transform-runtime']
					}
				}
			},
			{
				test: /\.scss|css$/i,
				use: [	
					{
						loader: isDev?"style-loader":MiniCssExtractPlugin.loader  // 将 JS 字符串生成为 style 节点, 或提前css到独立文件
					}, {
						loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
					}, {
						loader: "postcss-loader" // 对css 进行 autoprefixer
					}, {
						loader: "sass-loader" // 将 Sass 编译成 CSS
					}]
			},
			{
				test: /\.(png|jpg|jpeg|gif|ico)$/i,
				use: {
					loader: "url-loader",
					options: {
						limit: 8192,
						name: 'static/images/[name].[hash:6].[ext]',
						publicPath: isDev ? "/" : cdn,
					}
				}
			}, {
				test: /\.(svg|woff|woff2|ttf|eot)$/i,
				use: {
					loader: "file-loader",
					options: {
						name: 'static/fonts/[name].[hash:6].[ext]',
						publicPath: isDev ? "/" : cdn,
					}
				}
			}]
	},
	plugins: [
		// 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。取代NoErrorsPlugin 插件
		//https://doc.webpack-china.org/plugins/no-emit-on-errors-plugin/
		new webpack.NoEmitOnErrorsPlugin(),

		new webpack.optimize.ModuleConcatenationPlugin(),  //启用webpack3 作用域提升

		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: isDev ? '[name].css' : 'static/css/[name].[hash:6].css',
			chunkFilename: isDev ? '[id].css' : 'static/css/[id].[hash:6].css',
		})
	]
}

//根据pages下面的文件夹获取生成 entries:{}
function getEntries(globPath) {
	var files = glob.sync(globPath, {
		cwd: './src/pages/'
	});
	var entries = {};
	//files类似:[ 'index/index.js', 'list/index.js' ],目前只支持一级目录，实际上可以任意扩展
	files.forEach(function (filepath) {
		var split = filepath.split('/');
		var name = split[0];
		entries[name] = filepath;
	});
	return entries;
}

//匹配src 目录下，约定pages目录下每一个子文件夹下的index.js为多页面入口文件
var entries = getEntries('*/index.js');


var hot = 'webpack-hot-middleware/client?reload=true';
//根据pages目录的每个页面配置HtmlWebpackPlugin()
Object.keys(entries).forEach(function (name) {
	// ["webpack-hot-middleware/client?reload=true", "./src/index.js"]
	baseConfig.entry[name] = isDev ? [hot, './src/pages/' + entries[name]] : './src/pages/' + entries[name];
	//baseConfig.entry['base'] = isDev ? [hot, './src/assets/commonjs/base.js'] : './src/assets/commonjs/base.js';

	var htmlPlugin = new HtmlWebpackPlugin({
		filename: name + '.html',
		template: './src/pages/' + name + '/index.html',
		inject: true,
		chunks: ['base', name],
		chunksSortMode: 'dependency'
	});
	baseConfig.plugins.push(htmlPlugin);
})


module.exports = baseConfig;