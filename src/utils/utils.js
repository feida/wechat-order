import wx from 'weixin-js-sdk'
import {wxConfigApi, chargeWx} from '../fetch/api.js'
function getCurrentTime() {
  var keep = '';
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var f = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  var rand = Math.round(Math.random() * 899 + 100);
  keep = y + '' + m + '' + d + '' + h + '' + f + '' + s;
  return keep; //20160614134947
}

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

// 获取地址栏查询参数
function getUrlQuery() {
  // if(url.indexOf("#") > -1) {
  //     var param = url.substring(url.indexOf("?")+1,url.indexOf("#"));
  // } else {
  //     var param = url.substring(url.indexOf("?")+1,url.length);
  // }
  // return param;
  return location.search.substring(1)
}

//地址参数转成对象
function urlToObj(url) {
  let obj = {};
  url.length > 0 && url.split('&').forEach(str => {
    let [k,v] = str.split('=');
    obj[k] = v;
  })
  return obj;
}

function objLength(input) {
  var type = toString(input);
  var length = 0;
  if (type != "[object Object]") {
    //throw "输入必须为对象{}！"
  } else {
    for (var key in input) {
      if (key != "number") {
        length++;
      }

    }
  }
  return length;
}
//验证是否是手机号码
function vailPhone(number) {
  let flag = false;
  let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (number.length != 11) {
    flag = flag;
  }else if (!myreg.test(number)) {
    flag = flag;
  }else{
    flag = true;
  }
  return flag;
}
//验证是否西班牙手机(6开头 9位数)
function ifSpanish(number) {
  let flag = false;
  let myreg = /^([6|7|9]{1}(\d+){8})$/;
  if (number.length != 9) {
    flag = flag;
  } else if (!myreg.test(number)) {
    flag = flag;
  } else {
    flag = true;
  }
  return flag;
}
//浮点型除法
function div(a, b) {
  var c, d, e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) { }
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) { }
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}
//浮点型加法函数
function accAdd(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return ((arg1 * m + arg2 * m) / m).toFixed(2);
}
//浮点型乘法
function mul(a, b) {
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) { }
  try {
    c += e.split(".")[1].length;
  } catch (f) { }
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

// 遍历对象属性和值
function displayProp(obj) {
  var names = "";
  for (var name in obj) {
    names += name + obj[name];
  }
  return names;
}
// 去除字符串所有空格
function sTrim(text) {
  return text.replace(/\s/ig, '')
}
//去除所有:
function replaceMaohao(txt) {
  return txt.replace(/\:/ig, '')
}
//转换星星分数
function convertStarArray(score) {
  //1 全星,0 空星,2半星
  var arr = []
  for (var i = 1; i <= 5; i++) {
    if (score >= i) {
      arr.push(1)
    } else if (score > i-1 && score < i + 1) {
      arr.push(2)
    } else {
      arr.push(0)
    }
  }
  return arr;
}

function wxLogin(oauth_url, callback) {
  var address = 'dianji.restoplus.cn';
  var appId = null;
  $.ajax({
    type: 'get',
    url: 'http://'+address+'/wechat/wechatAppId/appId',
    success: function (result) {
      appId = result.data;
      console.log(appId);
      callback && callback(appId);
      // 跳转到微信授权页面
      var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=http://"+address+"/index.html&response_type=code&scope=snsapi_userinfo&state=STATE"+ encodeURIComponent("#/wechat_redirect");
      window.location = url;
    }
  })
}
// https://github.com/cubiq/iscroll/issues/361
// hasbug commented on 15 Dec 2016
function iScrollClick() {
  if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
  if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
  if (/Silk/i.test(navigator.userAgent)) return false;
  if (/Android/i.test(navigator.userAgent)) {
      var s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
      return parseFloat(s[0] + s[3]) < 44 ? false : true
  }
}

// yyyy-MM-dd hh:mm
Date.prototype.format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
		// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
			.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
				: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function wxOpenLocation(latitude,longitude,name,address){
  wx.openLocation({
    latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
    longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
    name: name, // 位置名
    address: address, // 地址详情说明
    scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
    infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
  });
}

function wxGetLocation(sbk){
  wx.getLocation({
    type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    success: function (res) {
      sbk && sbk(res);
    },
    cancel: function(res){
      sbk && sbk(res)
    },
    fail:function(res){
      sbk && sbk(res)
    },
    error:function(res){
      sbk && sbk(res)
    }
  });
}
// 配置一般的js-sdk
async function wxConfig() {
  let params = {"query": getUrlQuery(window.location.href)};
  let configRes = await wxConfigApi.config($.param(params));
  configRes.debug = true;
  wx.config(configRes.data);
}
// 配置支付的sdk 
async function wxConfigPay() {
  let params =  {"query": getUrlQuery(window.location.href)};
  let jsConfig = await chargeWx.jsWxPayconfig(params);
  wx.config(jsConfig.data);
}

export default {
  getUrlParam: getUrlParam,
  getUrlQuery: getUrlQuery,
  urlToObj: urlToObj,
  getCurrentTime: getCurrentTime,
  objLength: objLength,
  displayProp: displayProp,
  sTrim: sTrim,
  replaceMaohao: replaceMaohao,
  vailPhone: vailPhone,
  ifSpanish: ifSpanish,
  div: div,
  mul: mul,
  accAdd: accAdd,
  convertStarArray: convertStarArray,
  wxLogin:wxLogin,
  iScrollClick: iScrollClick,
  wxOpenLocation:wxOpenLocation,
  wxGetLocation: wxGetLocation,
  wxConfig,
  wxConfigPay
}

