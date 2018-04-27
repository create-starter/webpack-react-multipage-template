module.exports = {
  //反向代理配置，所有以/api 开头的转向 target 地址
  proxy:{
    baseUrl:'/api',
    options:{
        target: 'http://172.17.105.23:8098/',
        changeOrigin: true,
        pathRewrite: {
            '^/api':  '/',     // rewrite path
        }
    }
  },
  //开发服务启动端口配置
  port:8181
}

