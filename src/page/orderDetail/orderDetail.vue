<template>
  <div class="order-wrap-confirm shadow">
    <h2 class="">{{shop.name}}</h2>
    <!-- 订单菜品 -->
    <div class="order-box order-food weui_dialog_hd">
      <div class="dialog-title">
        <div class="order-time-box">
          <span class="time-txt">下单时间:</span>
          <span class="time-val">{{orderInfo.createTime && orderInfo.createTime.time | formatTime}}</span>
        </div>
        <!-- 订单状态 -->
        <div class="order-status">{{statusText}}</div>
      </div>
      <div class="order-food-box">
        <span v-if="item.type!=4 && item.count!=0" v-for="(item, index) in orderInfo.orderItems">{{item.articleName}}</span>
      </div>
      <div class="food-bottom">
        <div class="table-number">
          桌号：1
        </div>
        <div class="order-food-price">
          <span class="food-count">共计{{orderInfo.countWithChild || orderInfo.articleCount}}个餐品</span>
          <span class="food-price">&yen;{{orderInfo.orderMoney}}</span>
        </div>
      </div>
    </div>
    <!-- 交易码 -->
    <h3>排号队列</h3>
    <div class="order-box order-coder weui_dialog_hd">
      <span class="coder-num">{{orderInfo.verCode}}</span>
      <span class="coder-num">{{orderInfo.verCode}}</span>
      <span class="coder-num">{{orderInfo.verCode}}</span>
      <span class="coder-num">{{orderInfo.verCode}}</span>
      <span class="coder-num">{{orderInfo.verCode}}</span>
      <span class="coder-num active">{{orderInfo.verCode}}</span>
    </div>
    
    <!-- <div class="weui_dialog_ft margin-top-0" >  -->
      <!-- <a href="javascript:;" class="weui-btn weui-btn_plain-default primary" @click="chargeWx()">更换方式</a>-->
      <!-- <a href="javascript:;" class="weui-btn weui-btn_plain-default primary" @click="chargeWx()">支付宝支付</a> 
      <a href="javascript:;" class="weui-btn weui-btn_plain-default primary" @click="chargeWx()">领取红包</a> -->
    <!-- </div> -->
    <!-- <OrderButton :order="orderInfo"></OrderButton> -->
  </div>
</template>

<script>
import { mapGetters,mapActions,mapMutations } from 'vuex'
import { chargeWx, orderStatus } from '../../fetch/api.js'
// import orderButton from './com/orderButton.vue'
import * as statusCfg from '../../config/statusCfg.js'              // 订单  生产状态配置
  export default {
    props: {
      orderId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        timerId: null,        // 定时器
        orderStates: {},      // 轮询订单状态
        orderInfo: {}         
      }
    },
    
    computed: {
      ...mapGetters([
        'customer',
        'shop'
      ]),
      statusText: function () {
        var state = this.orderInfo.orderState;
        var proState = this.orderInfo.productionStatus;
        var st = "";
        switch (state) {
          case 1:
            // 离线支付方式
            if(this.orderInfo.payMode == 3 || this.orderInfo.payMode == 4 || this.orderInfo.payMode == 5 || this.orderInfo.payMode == 6){
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
            if (this.orderInfo.isPosPay == 1){
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
      }
    },
    components: {
      // OrderButton: orderButton
    },
    created() {
      // 判断是否有正在处理的订单
      this.currOrderId = this.$route.query.orderid || '';
      let params = {orderId: this.currOrderId};
      orderStatus.customerNewOrder($.param(params)).then(res => {
        if (res.success == true && res.data) {
          this.orderInfo = res.data;
          if (res.data.orderState == 10 && res.data.allowAppraise==true ) {
            // 已消费并可评论 弹出红包
            this.showComments = true;
          } else if (res.data.productionStatus == 2 && res.data.orderMode==2) {
          // 如果打印状态为已打印且为电视叫号模式
          // orderMode|shopMode 1:（废弃） 2:电视叫号 3:验证码 4：废弃 5：废弃 6： boss（有先付后付）
            // this.OrdersQueue = true;
          } else {
            // 弹出轮询订单状态组件
            // this.showOrderState = true;
          }
        }
      })

      // 轮询订单状态 
      this.timerId = setInterval(() => {
        let params = {orderId: this.orderInfo.id}
        orderStatus.getOrderStates($.param(params)).then(res => {
          if (res.statusCode === "200") {
            this.orderStates = res.data;
            this.orderInfo = {...this.orderInfo, ...this.orderStates}
          }
        })
      }, 1000)
    },
    beforeDestroy() {
      // 清除定时器
      clearInterval(this.timerId);
    },
    methods: {
      chargeWx() {
        
      },
      
    },
    filters: {
      orderState(orderState) {
        if (orderState) {
          return statusCfg.order[orderState].txt;
        }
      },
      formatTime(time) {
        var now = new Date(time*1);
        var year = now.getFullYear();    
        var month = now.getMonth()+1;    
        var date = now.getDate();    
        var hour = now.getHours();    
        var minute = now.getMinutes();
        minute = minute < 10 ? '0' + minute : minute;    
        var second = now.getSeconds();    
        second = second < 10 ? '0' + second : second;
        // return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;   
        return year+"-"+month+"-"+date+" "+hour+":"+minute;   
      },
    }
  }
</script>

<style lang="less">
  .order-wrap-confirm {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background-color: #eee;
    >h2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      padding-left: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
      text-align: left;
      height: 2rem;
      line-height: 2rem;
    }
    >h3 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      padding-left: 1rem;
      font-size: 1.1rem;
      font-weight: 500;
      text-align: left;
      height: 2rem;
      line-height: 2rem;
    }
    >.order-box {
      background-color: #fff;
      border-radius: 6px;
      margin: 0 0.6rem;
      padding: 1rem;
      position: relative;
      &.order-food {
        .food-bottom {
          display: flex;
          justify-content: space-between;
          >.table-number {
            margin-top: 18px;
            height: 1.5rem;
            line-height: 1.5rem;
            // vertical-align: bottom;
          }
        }
      }
    }
    .dialog-title {      
      .order-time-box {
        text-align: left;
        .time-txt {
          color: #868686;
          font-size: 1rem;
        }
        .time-val {
  
        }
      }
      >.order-status {
        position: absolute;
        right: 0;
        top: 6px;
        font-size: 1.1rem;
        color: #fff;
        background-color: #000;
        padding: 2px 6px 2px 4px;
        border-radius: 5px 0 0 5px;
      }
    }
    .order-food {
      .order-food-box {
        display: flex;
        justify-content: flex-start;
        > span {
          background-color: #eee;
          padding: 4px 6px;
          margin-right: 4px;
        }
      }
      .order-food-price {
        text-align: right;
        margin-top: 15px;
        height: 1.5rem;
        >.food-price {
          color: #BD2B2F;
          font-size: 1.2rem;
        }
        >.food-count {
          color: #868686;
        }
      }
    }
    .order-coder {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      text-align: center;
      // border-bottom: none;
      >.coder-txt {
        color: #868686;
        font-size: 1.1rem;
      }
      >.coder-num {
        display: block;
        width: 25%;
        color: #242424;
        font-size: 1.2rem;
        padding: 4px;
        margin-bottom: 0.5rem;
        border: 1px solid #eee;
        border-radius: 6px;
        &.active {
          background-color: #eee;
        }
      }
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
      width: 100%;
      position: absolute;
      bottom: 2rem;
      left: 0;
      line-height: 40px;
      display: flex;
      justify-content: space-around;
      // border-top: 1px solid #e5e5e5;
    }

    .weui_dialog_ft a.primary {
      flex: 1;
      margin: 6px;
      font-size: 1.2rem;
      background-color: #000;
      color: #fff;
      text-align: center;
      line-height: 40px;
    }

    .weui_dialog .weui_dialog_ft a {
      // margin: 10px;
      border-radius: 5px;
      position: relative;
    }
    .dialog-close {
      position: absolute;
      bottom: -6rem;
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
