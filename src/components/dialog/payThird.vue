<template>
<!-- 微信|支付宝支付 -->
  <div class="weui_dialog_confirm sencond_mask pay-third-wrap">
    <div class="weui_mask"></div>
    <div class="weui_dialog shadow">
      <div class="weui_dialog_hd title-box"><h2 class="weui_dialog_title">实付金额</h2><p class="total-price">&yen;{{pay.toFixed(2)}}元</p></div>
      <div class="weui-cells weui-cells_checkbox">
          <label class="weui-cell weui-check__label" for="s11">
              <div class="weui-cell__bd">
                <img class="pull-left imgBox" src="data:image/png;base64,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">
                <p>微信支付</p>
              </div>
              <div class="weui-cell__hd">
                  <input type="radio" class="weui-check" name="checkbox1" v-model="payType" id="s11" :value="1">
                  <i class="weui-icon-checked"></i>
              </div>
          </label>
          <label v-if="brandSetting.data.aliPay == 1 && shop.aliPay == 1" class="weui-cell weui-check__label" for="s12">
              <div class="weui-cell__bd">
                <img class="pull-left imgBox" src="data:image/jpg;base64,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">
                <p>支付宝支付</p>
              </div>
              <div class="weui-cell__hd">
                  <input type="radio" class="weui-check" name="checkbox1" v-model="payType" id="s12" :value="2">
                  <i class="weui-icon-checked"></i>
              </div>
          </label>
          <label v-if="brandSetting.data.openShanhuiPay==1 && shop.openShanhuiPay==1" class="weui-cell weui-check__label" for="s13">
              <div class="weui-cell__bd">
                <img class="pull-left imgBox" src="data:image/jpg;base64,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">
                <p>闪惠支付</p>
              </div>
              <div class="weui-cell__hd">
                  <input type="radio" class="weui-check" name="checkbox1" v-model="payType" id="s13" :value="3">
                  <i class="weui-icon-checked"></i>
              </div>
          </label>
      </div>
      <div class="weui_dialog_ft margin-top-0" @click="doPayMoney">
        <a href="javascript:;" class="weui-btn weui-btn_plain-default primary">确认支付&yen;{{pay.toFixed(2)}}</a>
      </div>
      <div class="dialog-close" @click="$emit('closePayThird')"><i class="iconfont icon-jiaochacross80"></i></div>
    </div>
  </div>
</template>

<script>
//{ "customerId": "51e57b47f51348819dd4c22208ff61a2", "distributionModeId": 1,//堂食 外卖 "useAccount": true,//使用余额 "orderItems": [{ "articleId": "d3d84fefcb334dc59be708ab2d3e3bf6", "count": 1, "type": 1,//1：单品 "discount": 100 }, { "articleId": "3013197674124c71950cef4dcf1d6e2a@259", "count": 1, "type": 2, "discount": 100 }, { "articleId": "ef72ea95fc04426b8dcf868187738b37", "count": 1, "type": 3, "mealItems": [7263, 7264, 7269, 7270], "discount": 100 }, { "articleId": "3479564f88b44fbba0a915ee2ea5744e", "count": 1, "type": 5, "name": "鲜榨西瓜汁(加冰)", "parentId": "e8dff896-7845-43bc-939c-747f8917da1b", //后付可以有加菜 "price": 10, "discount": 100 }], "waitMoney": 0,//等位金额 "waitId": null,//等位id "servicePrice": 0,//桌位费 "mealFeePrice": 0,//餐盒费 "mealAllNumber": 0,// "beforeId": null,//加菜前的id "paymentAmount": 0,//实际支付金额 "memberDiscountMoney": 0,//会员折扣金额 "groupId": null,//多人 "payType": 0//0：微信 1支付宝 }
import { mapGetters,mapActions,mapMutations } from 'vuex'
import * as TYPE from '../../store/actionType/orderType'
import { wxConfigApi, chargeWx, orderStatus } from '../../fetch/api.js'
import Utils from '../../utils/utils.js'
import wx from 'weixin-js-sdk'                                             // 微信sdk
  export default {
    props: {
      orderBossId: {
        type: String
      },
      lastOrder: {
        type: Object
      },
      // 道具+余额
      price: {
        type: Number
      },
      // 第三方支付
      pay: {
        type: Number
      }
    },
    data() {
      return {
        payType: 1, // 默认是微信
        // orderid: '', // 服务端返回的订单id
      }
    },
    computed: {
      ...mapGetters([
        'customer',
        'shop',
        'brandSetting',
        'cartItem',
        'orderParams'
      ])
    },
    created() {
    },
    methods: {
      doPayMoney() {
        // 设置支付类型
        this.$store.commit(TYPE.SET_ORDER_PARAMS, {...this.orderParams,payMode:this.payType});        
        if (this.payType == 1) {        // 微信支付
          let successCbk = (orderid) => {
            // 清理
            // 清空购物车|后付模式
            this.$store.commit('clearLastCartItem');
            this.$store.commit('clearCartItem');
            // 刷新余额
            this.$store.dispatch('getCustomer', {code: ''});
            // 刷新优惠券
            this.$store.dispatch('SET_LIST_COUPON_BY_STATUS');
            // 跳转到我的页面
            this.$router.push({ path: '/user/my',query:{orderid: orderid}});
          }
          let errorCbk = response => {
            this.$kiko_message({
                isShow: true,
                message: response.message,
                time: 2000,
                type: 2
              })
          }
          // 取消微信支付的回调
          let cancelCbk = async orderId => {
            let params = {orderId: orderId}
            await orderStatus.refundPaymentByUnfinishedOrder($.param(params));
          }
          this.openWechatPayNew(successCbk, errorCbk, cancelCbk);
        } else if (this.payType == 2) { // 支付宝支付
          this.openAliPay();
        }
      },
      // 生成订单
      async saveOrder(payMode) {
        let params = {shopId: this.shop.id, payMode: payMode};
        let res = await chargeWx.checkShopOpenNewPosNow($.param(params))

        if (res.success == true) {
          // 上传订单信息
          let params = {orderArray: JSON.stringify(this.orderParams)};
          // console.log(JSON.stringify(this.orderParams));
          // let params = {orderArray: '{"customerId":"51e57b47f51348819dd4c22208ff61a2","distributionModeId":1,"useAccount":true,"orderItems":[{"articleId":"d3d84fefcb334dc59be708ab2d3e3bf6","count":1,"type":1,"discount":100}],"waitMoney":0,"waitId":null,"servicePrice":0,"mealFeePrice":0,"mealAllNumber":0,"beforeId":null,"paymentAmount":0,"memberDiscountMoney":0.15000000000000002,"memberDiscount":0.85,"groupId":null,"payType":0}'};
          let res = await chargeWx.saveOrder($.param(params));
          if (res.success == true) {
            let orderid = res.data.id;
            let params = {
              orderId : orderid,					      //订单ID
            }
            
            return params;
          }
        } else {
          throw new Error(res.message)
        }
      },
      // 微信支付
      async openWechatPayNew(successCbk, errorCbk, cancelCbk) {
        try {
          let orderInfo;
          if (this.orderBossId) {// 后付支付
            await this.afterPay(1);
            orderInfo = {orderId: this.orderBossId}
          } else {
            orderInfo = await this.saveOrder(1);
          }
          

          let payConfig = await chargeWx.payOrderWx($.param(orderInfo))
          if (payConfig.success) {
            let js_api_params = payConfig.data;
            await Utils.wxConfigPay()
            wx.ready(function() {
              wx.chooseWXPay({
                  timestamp : js_api_params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                  nonceStr : js_api_params.nonceStr, // 支付签名随机串，不长于 32 位
                  "package" : js_api_params["package"], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                  signType : js_api_params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  paySign : js_api_params.paySign, // 支付签名
                  success : function(res) {
                    successCbk && successCbk(orderInfo.orderId);
                  },
                  cancel:function(res){
                    cancelCbk && cancelCbk(orderInfo.orderId);
                  },
                  fail:function(res){
                    alert("fail:"+res.errMsg);
                  },
                  error:function(res){
                    alert("error"+res);
                  }
              });
            })
          } else {
            errorCbk && errorCbk(JSON.stringify(payConfig));
          }
        } catch(e) {
          alert(e.message);
        }

      },
      // 支付宝支付
      async openAliPay() {
        try {
          let orderInfo;
          if (this.orderBossId) {// 后付支付
            await this.afterPay(2);
            orderInfo = {orderId: this.orderBossId}
          } else {
            orderInfo = await this.saveOrder(2);
          }
          // this.$router.push({ path: '/pay/alipay',query:{orderId: orderInfo.orderId}});
          location.href = location.origin + '/aliPay.html?orderId='+orderInfo.orderId;
        } catch(e) {
          this.$kiko_message({
            isShow: true,
            message: e.message,
            time: 2000,
            type: 2
          })
        }
      },
      // 后付要请求的接口
     async afterPay(payMode) {
      //  try {
         let params = {
           orderId: this.lastOrder.id,
           couponId: this.lastOrder.useCoupon,
           price: this.price,      // 系统内的金额(是计算属性)
           pay: this.pay,          // 第三方需要支付的钱(是计算属性)
           waitMoney: 0,           // 废弃
           payMode: payMode        // 支付的方式
         };
         let res = await orderStatus.afterPay($.param(params));
         if (!res.success) throw new Error(res.message)
        //  // 清空购物车|后付模式
        //  this.$store.commit('clearLastCartItem');
        //  this.$store.commit('clearCartItem');
        //  // 刷新余额
        //  this.$store.dispatch('getCustomer', {code: ''});
        //  // 刷新优惠券
        //  this.$store.dispatch('SET_LIST_COUPON_BY_STATUS');
         // 跳转到我的页面
         // this.$router.push({ path: '/user/my', query:{orderid: this.lastOrder.id}});
      //  } catch(e) {
      //    alert(e.message)
      //    throw e;
      //  }
      }
    }
  }
</script>

<style scoped lang="less">
  .pay-third-wrap {
    .title-box {
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .total-price {
        font-size: 1.4rem;
        font-weight: bold;
        color: #C81623;
      }
    }
    .imgBox {
      width: 25px;
      height: 25px;
      margin: 0 15px;
      position: relative;
      // top: 3px;
    }
    .pull-left {
      float: left;
    }
    h2 {
      font-size: 1.5rem;
      height: 3rem;
      line-height: 3rem;
    }
    .weui_mask {
      position: fixed;
      z-index: 1;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .weui_dialog {
      position: fixed;
      z-index: 1;
      width: 80%;
      height: auto;
      top: 5%;
      left: 0;
      right: 0;
      margin: auto;
      text-align: center;
      background: #fff;
      border-radius: 10px;
      .weui_cell {
        border-bottom: 0;
        text-align: left;
      }
    }

    .weui-cells {
      margin-top: 0;
    }
    .weui_dialog_confirm .weui_dialog .weui_dialog_hd {
      padding: 5px 10px;
      border-bottom: 1px solid #e5e5e5;
      .weui_dialog_title {
        font-weight: 400;
        font-size: 17px;
      }
    }

    label.weui-cell {
      display: flex;
      justify-content: space-between;
      text-align: left;
    }
    .weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before {
      color: #000;
    }

    .weui_dialog_ft {
      line-height: 35px;
    }

    .weui_dialog_ft a.primary {
      background-color: #000;
      color: #fff;
      text-align: center;
      line-height: 35px;
    }

    .weui_dialog .weui_dialog_ft a {
      margin: 10px;
      border-radius: 5px;
      position: relative;
    }
    .dialog-close {
      position: absolute;
      display: block;
      color: #fff;
      padding-top: 10px;
      width: 100%;
      z-index: 1;
      text-align: center;
      > i {
        font-size: 4em;
      }
    }
  }
</style>
