import {
  shopListApi,
  switchShopInfo,
  customerApi,
  couponApi
} from '../../fetch/api'
import * as TYPE from '../actionType/customerType'

const state = {
  customer: {},   // 用户信息(包含昵称头像 是否注册 账户余额等)
  cityList: [],   // 城市列表
  shopList: [],   // 门店列表
  memberActivityByTelephone: {},  // 折扣
  listCoupon0: [],         // 优惠券 未使用
  listCoupon1: [],         // 优惠券 已使用
  listCoupon2: [],         // 优惠券 已过期
  wxConf: {}               // wx.config 参数
};

const getters = {
  customer: state => state.customer,
  cityList: state => state.cityList,
  shopList: state => state.shopList,
  memberActivityByTelephone: state => state.memberActivityByTelephone,  // 折扣
  listCoupon0: state => state.listCoupon0,         // 优惠券 未使用
  listCoupon1: state => state.listCoupon1,         // 优惠券 已使用
  listCoupon2: state => state.listCoupon2,         // 优惠券 已过期
};

const actions = {
  async logIn({dispatch, commit,state}, payload) {
    // 从服务端获取customer
    let params = {
      code: payload.code
    }
    let response = await customerApi.customer($.param(params));
    commit(TYPE.GET_CUSTOMER_SUCCESS, response);
    // 推送 直接跳转到某个店
    if (payload.shopId) {
      await switchShopInfo.switch(payload.shopId)
    } else {
      // 店铺列表页
      let res = await shopListApi.shopList('name=')
      commit(TYPE.SET_SHOP_LIST, res)
      res = await shopListApi.selectByShopCity()
      commit(TYPE.SET_CITY_LIST, res)
    }
    
    await dispatch('reInitStore', response.data);
  },
  getCustomer({dispatch, commit,state}, payload) {
    // 从服务端获取customer,获取最新的用户信息
    let params = {
      code: payload.code
    }
    customerApi.customer($.param(params)).then((response) => {
      commit(TYPE.GET_CUSTOMER_SUCCESS, response);
    });
  },
  // 页面刷新重新 获取store数据
  reInitStore({dispatch, commit,state}, payload) {
    // 获取折扣
    let params = {telephone: payload.telephone};
    // customerApi.getMemberActivityByTelephone($.param(params)).then(res => {
    customerApi.getMemberActivityByTelephone('telephone='+params.telephone).then(res => {
      commit(TYPE.SET_MEMBER_ACTIVITY_BY_TELEPHONE, res);
      dispatch('getArticlelist');             // order页需要的请求
      dispatch('SET_LIST_COUPON_BY_STATUS');  // 获取优惠券

    })
  },
  getWxConfig({dispatch, commit,state}, payload) {
    
  },
  // 获取优惠券
  [TYPE.SET_LIST_COUPON_BY_STATUS]({commit, state}) {
    let params = {status: 0};
    couponApi.coupon($.param(params)).then(res => {
      res.status = 0
      commit(TYPE.SET_LIST_COUPON_BY_STATUS, res);
    })
    params = {status: 1};
    couponApi.coupon($.param(params)).then(res => {
      res.status = 1
      commit(TYPE.SET_LIST_COUPON_BY_STATUS, res);
    })
    params = {status: 2};
    couponApi.coupon($.param(params)).then(res => {
      res.status = 2
      commit(TYPE.SET_LIST_COUPON_BY_STATUS, res);
    })
  },
};

const mutations = {
  // 获取customer
  [TYPE.GET_CUSTOMER_SUCCESS](state, res) {
    state.customer = res.data;
  },
  [TYPE.SET_CITY_LIST](state, res) {
    state.cityList = res.data;
  },
  [TYPE.SET_SHOP_LIST](state, res) {
    state.shopList = res.data;
  },
  [TYPE.RESET_SHOP_LIST](state,res) {
    state.shopList = state.shopList.map(function (item) {
      let map = new BMap.Map();
      // let pointA = new BMap.Point(item.latitude, item.longitude);
      let pointA = new BMap.Point(item.longitude, item.latitude);
      if(res.length>0){
        let pointB = new BMap.Point(res[1],res[0]);
        item.distance = map.getDistance(pointA, pointB).toFixed(0) + 'm';
        if(parseInt(item.distance) > 1000){
          item.distance = (Math.round(parseInt(item.distance)/100)/10).toFixed(2) + "km";
        }
      }else{
        item.distance = "未知";
      }
      return item
    })
  },
  // 获取折扣
  [TYPE.SET_MEMBER_ACTIVITY_BY_TELEPHONE](state, res) {
    state.memberActivityByTelephone = res.data;
  },
  // 获取优惠券
  [TYPE.SET_LIST_COUPON_BY_STATUS](state, res) {
    if (res.status == 0) {
      state.listCoupon0 = res.data;
    } else if (res.status == 1) {
      state.listCoupon1 = res.data;
    } else if (res.status == 2) {
      state.listCoupon2 = res.data;
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}
