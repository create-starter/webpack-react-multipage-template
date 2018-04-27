import axios from 'axios';
let Util = {};

// 获取url参数,将url => objec ?a=1&b=1
Util.getQueryObject = function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  var search = url.substring(url.lastIndexOf("?") + 1);
  var obj = {};
  var reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, function (rs, $1, $2) {
      var name = decodeURIComponent($1);
      var val = decodeURIComponent($2);
      val = String(val);
      obj[name] = val;
      return rs;
  });
  return obj;
}


/* ---------- 创建类似jq：$ 的ajax 实例----------------- */
let baseURL = 'http://172.17.105.51:8085/';   //开发环境 
//环境判断
if(window.location.hostname.indexOf("itshizhan.com")>=0){
  baseURL="/api/";
}else if(window.location.hostname.indexOf("itshizhan.cc")>=0){
  baseURL="/api/";
}else{
  //baseURL = 'http://172.17.105.51:8085/';  
  baseURL="/api/";
}

const $ =  axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
});

Util.setPageTitle = function(title){
  document.getElementsByTagName("title")[0].innerText = title;
}

export { $ };
export default Util;