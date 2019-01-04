import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import VIscroll from 'viscroll'
import axios from 'axios'
import base from './base'
import store from './store/'
import VueBus from 'vue-bus'
import Kiko from './components/Global/index.js'
import Utils from './utils/utils.js'
import './filters/filters.js'

Vue.prototype.$http = axios;
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
// axios.defaults.crossDomain = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios拦截器统一处理loading
// 请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之
  store.commit('SetRequesting', true);
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  store.commit('SetRequesting', false);
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

// https://github.com/cubiq/iscroll/issues/674
// orenagiv commented on 28 Apr 2014
Vue.use(VIscroll, {
  // click: Utils.iScrollClick,
  click: false,
  // preventDefault: true,
  preventDefaultException:{tagName:/.*/},
  tap: false,
  bounce: true,
  disableMouse: true,
  disablePointer: true,
  disableTouch: false
});
Vue.use(Vuex);
Vue.use(base);
Vue.use(Kiko);
Vue.use(VueBus)

router.beforeEach(function (to,from,next) {
  // console.log(to,from,next)
  //需求登录判断
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // console.log(JSON.stringify(to))
  if (to.meta.auth ) {
    if (process.env.NODE_ENV === 'production') {
      if ( ! sessionStorage.getItem('appId')) {
        if (location.search.indexOf('code') === -1) {//只保存推送 分享的参数
          sessionStorage.setItem('searchParam', location.search.substring(1))
        }
        Utils.wxLogin('', appId=> {
            // 跳转到外链
            sessionStorage.setItem('appId', appId)
          }
        )
      } else if (location.href.indexOf('wechat_redirect') !== -1 && !sessionStorage.getItem('code')) {
        let code = Utils.getUrlParam("code");
        sessionStorage.setItem('code', code);
        
        let searchParam = sessionStorage.getItem('searchParam') || '';
        let urlParam = Utils.urlToObj(searchParam);
        if (urlParam.dialog) {
          if (urlParam.dialog === 'redpackage') {// 推送-点击领取红包 ?subpage=my&dialog=redpackage&orderId=" + order.getId() + "&shopId=" + order.getShopDetailId(); 
            store.dispatch('logIn', {code: code, shopId: urlParam.shopId}).then(() => next('/user/my'));            
          } else if (urlParam.dialog === 'share' || urlParam.dialog === 'sharefriend') {//推送-立即分享红包 ?shopId=" + customer.getLastOrderShop() + "&subpage=home&dialog=share&appraiseId=" + appraise.getId() + " 
            // 弹注册
            store.dispatch('logIn', {code: code, shopId: urlParam.shopId}).then(() => next('/user/home'));            
          } else if (urlParam.dialog === 'myYue') {// 推送-查看余额 "?subpage=my&dialog=myYue&shopId=" + order.getShopDetailId()
            // 弹余额组件
            store.dispatch('logIn', {code: code}).then(() => next({path:'/user/my', query: {myYue: true}}));            
          } else if (urlParam.dialog === 'scanAqrCode') {//推送-打开邀请二维码 "?dialog=scanAqrCode&subpage=my&shopId=" + order.getShopDetailId();
            // 打开个人二维码
            store.dispatch('logIn', {code: code, shopId: urlParam.shopId}).then(() => next({path:'/user/home', query: {scanAqrCode: true}}));            
          } else if (urlParam.orderBossId && urlParam.dialog === 'closeRedPacket') { //推送-点击这里进行“加菜” 或“买单” -买单 "?orderBossId=" + order.getId() + "&articleBefore=1&dialog=closeRedPacket&shopId=" + order.getShopDetailId();
            store.dispatch('logIn', {code: code, shopId: urlParam.shopId}).then(() => next({path:'/user/placeOrder', query: {orderBossId: urlParam.orderBossId}}));            
          } else if (urlParam.dialog === 'waitScan') {//推送-点击此处，扫一扫桌位二维码，开启美食之旅 '?dialog=waitScan'
            // todo另外一个项目
          } else if (true) {// 推送-请点击详情进入订单列表开具发票 ?baseUrl="+baseUrl+"&invoiceType="+2+"&shopId="+shop.getId()+"&customerId="+customer.getId();

          } else if (urlParam.waitQueue) {// 推送-请留意叫号信息 ?subpage=my&waitQueue=" + order.getId() + "&shopId=" + order.getShopDetailId()
            // 弹 等待队列
            store.dispatch('logIn', {code: code, shopId: urlParam.shopId}).then(() => next({path:'/user/my', query: {waitQueue: urlParam.waitQueue}}));
          }
        } else {
          // store.dispatch('logIn', {code: code}).then(() => next('/user/order'));
          store.dispatch('logIn', {code: code}).then(() => next('/resto/shopHome'));//店铺列表，选店铺
        }
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
