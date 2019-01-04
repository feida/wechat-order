import Vue from 'vue'
import * as statusCfg from '../config/statusCfg.js'      // 状态配置

Vue.filter('statusText', function(order) {
  // console.log(JSON.stringify(order))
  var state = order.orderState;
  var proState = order.productionStatus;
  var st = "";
  switch (state) {
    case 1:
      // 离线支付方式
      if(order.payMode == 3 || order.payMode == 4 || order.payMode == 5 || order.payMode == 6){
          st = "付款中";
      }else{
          st = statusCfg.order[state].txt; //未付款
      }
      break;
    case 2:
      st = statusCfg.production[proState].txt;
      break;
    case 9:
      st = statusCfg.order[state].txt;
      break;
    case 10:
      if (order.isPosPay == 1){
          st = statusCfg.order[state].txt;
      }else{
          st = statusCfg.production[proState].txt;
      }
      break;
    case 11:
      st = statusCfg.order[state].txt;
      break;
  }
  return st;
})
