/*******************************************************************
 * 本拷贝工具使用到了nodejs的最新Api: fs.copyFile,需要nodejs v8.5 以上版本
 * fs.copyFile(src, dest[, flags], callback)
 * created by leeson8888
 */

const path = require('path');
const fs = require('fs');
const colors = require('colors');

const templatesPath = path.resolve(__dirname, '..', 'config/templates');
const distDir = process.argv[2];

if (!distDir) {
	console.log("缺少需要创建的模板文件夹名称\n正确语法: npm run copy 目标文件夹名称".red);
	process.exit();
	return;
}

const distPath = path.resolve(__dirname, '..', 'src/pages') + "/" + distDir;

function copyDir(srcDir, destDir) {
	var files = fs.readdirSync(srcDir);
	for (let file of files) {
		let srcFile = srcDir + "/" + file;
		let destFile = destDir + "/" + file;
		fs.copyFile(srcFile, destFile, (err) => {
			if (err) throw err;
			console.log((file + ' 文件创建成功…').green);
		})
	}
}
//copyDir(templatesPath,distPath);

//复制文件前判断目标文件夹是否存在，不存在需要先创建目录
var exists = function (destDir, callback) {
	fs.exists(destDir, function (exists) {
		if (exists) {
			console.log( ("当前项目的pages目录已经存在"+ distDir +"文件夹").red );
			process.stdout.write('是否删除'+distDir+"文件夹,重新创建？");
			console.log("y/n,请输入>".yellow);
			let stdinStr = "";
			process.stdin.setEncoding('utf-8');
			process.stdin.on('data', function (chunk) {
				//务必使用trim，否则会有空格。或使用readline模块
				stdinStr = chunk.toString().trim(); 
				if(stdinStr == "y"){
					process.stdin.pause();
					console.log("正在重新创建…");
					callback(templatesPath, destDir);
				}else{
					process.exit();
				}
			});
		}else{
			// 不存在
			fs.mkdir(destDir, function () {
				callback(templatesPath, destDir);
			});
		}
	});
};

exists(distPath,copyDir);