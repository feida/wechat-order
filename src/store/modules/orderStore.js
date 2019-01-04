// import {
//   customerApi
// } from '../../fetch/api'
import * as TYPE from '../actionType/orderType'

const state = {
  //{ "customerId": "51e57b47f51348819dd4c22208ff61a2", "distributionModeId": 1,//堂食 外卖 "useAccount": true,//使用余额 "orderItems": [{ "articleId": "d3d84fefcb334dc59be708ab2d3e3bf6", "count": 1, "type": 1,//1：单品 "discount": 100 }, { "articleId": "3013197674124c71950cef4dcf1d6e2a@259", "count": 1, "type": 2, "discount": 100 }, { "articleId": "ef72ea95fc04426b8dcf868187738b37", "count": 1, "type": 3, "mealItems": [7263, 7264, 7269, 7270], "discount": 100 }, { "articleId": "3479564f88b44fbba0a915ee2ea5744e", "count": 1, "type": 5, "name": "鲜榨西瓜汁(加冰)", "parentId": "e8dff896-7845-43bc-939c-747f8917da1b", //后付可以有加菜 "price": 10, "discount": 100 }], "waitMoney": 0,//等位金额 "waitId": null,//等位id "servicePrice": 0,//桌位费 "mealFeePrice": 0,//餐盒费 "mealAllNumber": 0,// "beforeId": null,//加菜前的id "paymentAmount": 0,//实际支付金额 "memberDiscountMoney": 0,//会员折扣金额 "groupId": null,//多人 "payType": 0//0：微信 1支付宝 }
  orderParams: {},   // 订单参数
  lastOrder: {},      // 继续点菜，上一个订单信息
  receipt: {},        // 当前发票 订单信息 
  // title: {},           // 选中发票title.
  defaultTitle: {},   // 默认的抬头
  receipt_type: 0,    //0:电子； 1：纸质
};

const getters = {
  orderParams: state => state.orderParams,
  lastOrder: state => state.lastOrder,
  receipt: state => state.receipt,
  receipt_type: state => state.receipt_type,
  defaultTitle: state => state.defaultTitle
};

const actions = {
  
};

const mutations = {
  [TYPE.SET_ORDER_PARAMS](state, res) {
    state.orderParams = res
    state.orderParams = {...state.orderParams}
  },
  // [TYPE.SET_LAST_ORDER](state, lastOrder) {
  //   state.lastOrder = lastOrder;
  // },
  [TYPE.SET_ORDER_RECEIPT](state, receipt) {
    state.receipt = receipt
  },
  // [TYPE.SET_RECEIPT_TITLE](state, title) {
  //   state.title = title
  // },
  [TYPE.SET_DEFAULT_TITLE](state, title) {
    state.defaultTitle = title
  },
  [TYPE.SET_RECEIPT_TYPE](state, type) {
    state.receipt_type = type
  }, 
};

export default {
  state,
  getters,
  actions,
  mutations
}
