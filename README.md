# webpack-react-multipage-template
webpack-react-multipage-template，基于webpack4的多页面模板，快速初始化一个react项目，集成axios


请配合 create-starter-cli 使用

# 安装

```sh
 npm install -g create-starter-cli
 create-starter webpack-multipage <path>
```


# 常用命令
```sh
# 新建一个页面
npm run copy <dir>

# dev
npm run dev

# build
npm run build
```

# 使用说明

1. src/public  目录下的文件不编译，不引用，直接copy 到dist/assets 目录 （copy-webpack-plugin）

