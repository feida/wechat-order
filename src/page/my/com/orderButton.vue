<template>
  <div class="">
    <!-- <a class="weui-btn " :class="customClass" @click="continueOrder" v-if="order.distributionModeId==1&&order.allowContinueOrder&&order.orderMode!=6">继续选购</a>
    <a class="weui-btn " :class="customClass" @click="continueOrder" v-if="order.distributionModeId==1&&order.orderMode==6&&order.allowContinueOrder&&order.productionStatus>=2&&(order.orderState>9||order.orderState==2||(order.orderState==1&&order.payMode!=3&&order.payMode!=4&&order.payMode!=5&&order.payMode!=6&&order.isPay!=11))">继续选购</a>
    <a class="weui-btn cancel-order-btn"   :class="customClass" @click="cancelOrder" v-if="order.orderMode != 6  && order.orderMode != 2 && order.orderMode != 7 && (((order.orderState==1||order.orderState==2)&&order.productionStatus==0) || (order.payMode == 2 && order.productionStatus == 1 &&( order.orderState == 1 || order.orderState == 2 )))">取消订单</a>
    <a class="weui-btn cancel-order-btn"   :class="customClass" @click="cancelOrder" v-if="order.orderMode == 6 && (order.payMode == 1 || order.payMode == 2) && order.orderState == 1 && order.payType == 0">取消订单</a>
    <a class="weui-btn " :class="customClass" @click="showOrderDetailed" v-if="(order.distributionModeId==1&&order.productionStatus==0&&order.orderState==2&&order.orderMode!=6) || (order.distributionModeId==1&&order.productionStatus==0&&order.orderState==1&&order.payMode== 2&&order.orderMode!=6&&order.orderMode!=3)">立即下单</a>
    <a class="weui-btn " :class="customClass" @click="payOrder" v-if="order.orderState==1 && order.payMode == 1 && order.orderMode != 6 && order.isPay != 1">微信支付</a>
    <a class="weui-btn " :class="customClass" @click="payOrderBoss" v-if="order.orderState==1 && order.orderMode==6 && order.productionStatus==2 &&( order.payMode == 1 || order.payMode == 0)">立即支付</a>
    <a class="weui-btn " :class="customClass" @click="payOrderBoss" v-if="order.orderState==1 && order.orderMode==6 && order.productionStatus==0 && order.payMode == 1">立即支付</a>
    <a class="weui-btn " :class="customClass" @click="showPayDaiLog"  v-if="order.orderState==1 && order.payMode == 2 && ((order.productionStatus >= 1 && order.orderMode ==6) || (order.productionStatus >= 0 && (order.orderMode == 2 || order.orderMode == 3 || order.orderMode == 7)))">更换方式</a>
    <a class="weui-btn " :class="customClass" @click="shanhuiPayDaiLog"  v-if="order.orderState==1 && order.payMode == 5">闪惠支付</a>
    <a class="weui-btn " :class="customClass" @click="receiveRedPapper" v-if="(order.orderMode==2||order.orderMode==7)&&order.productionStatus>=2&&order.allowAppraise">领取红包</a>
    <a class="weui-btn " :class="customClass" @click="receiveRedPapper" v-if="order.orderMode!=2&&order.orderMode!=7&&order.orderMode!=6&&order.allowAppraise">领取红包</a>
    <a class="weui-btn " :class="customClass" @click="receiveRedPapper" v-if="order.payType==0&&order.orderMode==6&&order.allowAppraise">领取红包</a>
    <a class="weui-btn " :class="customClass" @click="receiveRedPapper" v-if="order.orderState==10&&order.payType==1&&order.orderMode==6&&order.allowAppraise">领取红包</a>
    <a class="weui-btn " :class="customClass" @click="jumpShare" v-if="order.isShare==1">分享返利</a>  -->





    <a class="weui-btn" :class="customClass" @click="continueOrder" v-if="order.distributionModeId==1&&order.allowContinueOrder&&order.orderMode!=6">继续选购</a>
    <a class="weui-btn" :class="customClass" @click="continueOrder" v-if="order.distributionModeId==1&&order.orderMode==6&&order.allowContinueOrder&&order.productionStatus>=2&&(order.orderState>9||order.orderState==2||(order.orderState==1&&order.payMode!=2&&order.payMode!=3&&order.payMode!=4&&order.payMode!=5&&order.payMode!=6))">继续选购</a>
    <a class="weui-btn" :class="customClass" @click="pushOrderClick" v-if=" (order.orderMode==3&&order.orderState==2&&tableNumber!=null) || (order.needScan == 1 && order.productionStatus==0&&order.orderState==2&&order.orderMode!=6 && order.orderMode!=2 && order.orderMode!=7 &&order.distributionModeId!=2) || (order.distributionModeId==1&&order.productionStatus == 0 && order.orderState == 1 && order.payMode == 2&&order.orderMode!=6&&order.orderMode!=2&&order.orderMode!=3&&order.distributionModeId!=2)">{{pushOrderBtnName}}</a>
    <a class="weui-btn disabled" :class="customClass" v-if="order.isPay==1&&order.orderState==1 && order.payMode==1 && order.orderMode != 6&&wechatPayTime.show">正在微信支付({{wechatPayTime.time}})</a>
    <a class="weui-btn" :class="customClass" @click="payOrder" v-if="order.isPay==0&&order.orderState==1&&order.payMode==1&&order.orderMode!=6">微信支付</a>
    <a class="weui-btn" :class="customClass" @click="payOrderBoss" v-if="order.orderMode==6 && order.orderState==1 && order.productionStatus==2 && order.payMode != 2 && order.payMode != 3 && order.payMode != 4 && order.payMode != 6  && order.payMode != 5">立即支付</a>
    <a class="weui-btn" :class="customClass" @click="payOrderBoss" v-if="order.orderMode==6 && order.orderState==1 && order.productionStatus==0 && order.payMode == 1">立即支付</a>
    <!-- <a class="weui-btn" :class="customClass" @click="autoPushOrder" v-if="order.orderState==1 && order.payMode==2 && order.productionStatus>=1">支付宝支付</a> -->
    <a class="weui-btn" :class="customClass" @click="showPayDaiLog" v-if="order.orderState==1 && order.payMode==2 && ((order.productionStatus >= 1 && order.orderMode ==6) || (order.productionStatus >= 0 && (order.orderMode == 2 || order.orderMode == 3 || order.orderMode == 7)))">更换方式</a>
    <a class="weui-btn" :class="customClass" @click="shanhuiPayDaiLog" v-if="order.orderState==1 && order.payMode==5">闪惠支付</a>
    <a class="weui-btn disabled" :class="customClass" v-if="order.orderMode!=2&&order.orderMode!=6&&remainPackageTime.show&&!order.allowAppraise">领取红包({{remainPackageTime.time}})</a>
    <a class="weui-btn disabled" :class="customClass" v-if="order.orderMode==2&&order.productionStatus>=2&&remainPackageTime.show&&!order.allowAppraise">领取红包({{remainPackageTime.time}})</a>
    <a class="weui-btn disabled" :class="customClass" v-if="order.orderMode==6&&order.orderState==2&&remainPackageTime.show&&!order.allowAppraise">领取红包({{remainPackageTime.time}})</a>
    <a class="weui-btn" :class="customClass" @click="showReceiveRed" v-if="order.orderMode==2&&order.productionStatus>=2&&order.allowAppraise">领取红包</a>
    <a class="weui-btn" :class="customClass" @click="showReceiveRed" v-if="order.orderMode!=2&&order.orderMode!=6&&order.allowAppraise">领取红包</a>
    <a class="weui-btn" :class="customClass" @click="showReceiveRed" v-if="order.payType==0&&order.orderMode==6&&order.allowAppraise">领取红包</a>
    <a class="weui-btn" :class="customClass" @click="showReceiveRed" v-if="order.orderState==10&&order.payType==1&&order.orderMode==6&&order.allowAppraise">领取红包</a>
    <a class="weui-btn" :class="customClass" @click="jumpAliPay" v-if="order.orderState==1&&order.payMode==2">支付宝支付</a>
    <a class="weui-btn" :class="customClass" @click="jumpShare" v-if="order.isShare==1">分享返利</a>
    <!-- <a href="tel:{{shop.phone}}" class="weui-btn" :class="customClass" v-if="order.customerAddressId && order.orderState==2">联系商家</a> -->

  </div>
</template>

<script>
import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
import { orderStatus } from '../../../fetch/api.js'
export default {
  props: {
    customClass: {
      type: Object,
      default: () => {
        return {
          'weui-btn_plain-default':true,
          'primary': true
        }
      }
    },
    orderInfo: {
      type: Object
    }
  },
  data() {
    return {
      // order: {},
      btnStatus: true,                              // 可否点击状态
      remainPackageTime: {show: false, time: 0},    // 红包倒计时
      wechatPayTime: {show: false, time: 60},
      orderStates: {},
      remainTimeInt: null,                          // 红包计时器
      pushOrderBtnName: '立即下单'
    }
  },
  computed: {
    ...mapGetters([
      // 'customer',
      'shop',       // 店铺设置
      'brandSetting' // 品牌设置
    ]),
    order() {
      return this.orderInfo;
    },
    // 红包剩余倒计时时间
    tickTime() {
      // var now = new Date().getTime();
      // var printOrderTime = 0;
      // if ( this.order.printOrderTime != null) {
      //   printOrderTime = this.order.printOrderTime.time;
      // }
      // if ( ! printOrderTime) {
      //   clearInterval(this.remainTimeInt);
      //   this.remainTimeInt = null;
      //   return 0;
      // }
      // var remindTime = (now - printOrderTime) / 1000;
      // if (this.shop.autoConfirmTime > remindTime) {
      //   this.remainPackageTime.show = true;
      //   this.remainPackageTime.time = parseInt(this.shop.autoConfirmTime - remindTime);
      //   this.remainPackagetime = {...this.remainPackageTime};
      //   return this.remainPackageTime.time
      // } else {
      //   this.remainPackageTime.show = false;
      //   this.remainPackagetime = {...this.remainPackageTime};        
      //   return 0;
      // }
    }
  },
  watch: {
    "order": function(order) {
      if (order.printOrderTime && order.printOrderTime.time) {
        var now = new Date().getTime();
        // var printOrderTime = 0;
        var printOrderTime = this.order.printOrderTime.time;
        
        var remindTime = (now - printOrderTime) / 1000;
        if (this.shop.autoConfirmTime > remindTime) {
          this.remainPackageTime.show = true;
          this.remainPackageTime.time = parseInt(this.shop.autoConfirmTime - remindTime);
          this.remainTimeInt = setInterval(() => {
            if (this.remainPackageTime.time >= 1) {
              this.remainPackageTime.time--;
              this.remainPackagetime = {...this.remainPackageTime};    
            }
          }, 1000)
        } else {
          this.remainPackageTime.show = false;
        }
        this.remainPackagetime = {...this.remainPackageTime};        
      }
    }
  },
  created() {
    // this.order = this.orderInfo;
    // console.log(JSON.stringify(this.order))

    // setInterval(()=> {
    //   console.log(this.tickTime)
    // }, 1000)
  },
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.remainTimeInt);
    this.remainTimeInt = null;
  },
  methods: {
    // 继续选购
    continueOrder() {
      this.$router.push({path: '/user/order', query: {parentOrder: this.orderInfo}});
    },
    // 支付宝支付
    jumpAliPay(){
      console.log(this.order.id);
      window.location.href = '../../aliPay.html?orderId='+this.order.id;
    },
    // 取消订单
    cancelOrder() {

    },
    // 立即下单
    // showOrderDetailed() {
    //   let params = {orderId: this.order.id};
    //   orderStatus.pushOrder($.param(params)).then(res => {
    //     // 重新请求
    //     let params = {orderId: this.order.id}
    //     orderStatus.getOrderStates($.param(params)).then(res => {
    //       if (res.statusCode === "200") {
    //         this.orderStates = res.data;
    //         this.order = {...this.orderInfo, ...this.orderStates};
    //       }
    //     })

    //   })

    // },
    // 微信支付
    payOrder() {
      // 引入组件
    },
    // 立即支付
    payOrderBoss() {
      this.$router.push({path:'/user/placeOrder', query: {orderBossId: this.order.id}})
    },
    // 更换方式
    showPayDaiLog() {

    },
    // 闪惠支付
    shanhuiPayDaiLog() {

    },
    // 领取红包
    showReceiveRed() {
      this.$emit('receive-red-papper', this.order.id)
    },
    // 分享返利
    jumpShare() {
      this.$emit('jump-share', this.order.id)
    }

  }
}
</script>

<style lang="less">
.disabled {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}
</style>
