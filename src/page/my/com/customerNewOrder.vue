<template>
<CloseWrap  @close-dialog="$emit('closeOrder')">
  <div class="weui_dialog_confirm sencond_mask new-order-wrap" slot="content">
    <!-- <div class="weui_mask"></div> -->
    <div class="weui_dialog shadow">
      <div class="weui_dialog_hd dialog-title">
        <h2 class="">{{shop.name}}</h2>
        <div class="order-time-box">
          <span class="time-txt">下单时间:</span>
          <span class="time-val">{{orderInfo.createTime && new Date(orderInfo.createTime.time).format('yyyy-MM-dd hh:mm')}}</span>
        </div>
        <!-- 订单状态 -->
        <div class="order-status">{{order | statusText}}</div>
      </div>
      <!-- 订单菜品 -->
      <div class="order-food weui_dialog_hd">
        <div class="order-food-box">
          <span v-if="item.type!=6 && item.count!=0" v-for="(item, index) in orderInfo.orderItems">{{item.articleName}}</span>
        </div>
        <div class="order-food-price">
          <span class="food-price">&yen;{{orderInfo.amountWithChildren || orderInfo.orderMoney}}</span>
          <span class="food-count">共计{{orderInfo.countWithChild || orderInfo.articleCount}}个餐品</span>
        </div>
      </div>
      <!-- 交易码 -->
      <div class="order-coder weui_dialog_hd">
        <span class="coder-txt">交易码: </span>
        <span class="coder-num">{{orderInfo.verCode}}</span>
      </div>
      <OrderButton class="weui_dialog_ft margin-top-0" 
        :orderInfo="order"
        @receive-red-papper="$emit('receive-red-papper', orderInfo.id)"
        @jump-share="$emit('jump-share', orderInfo.id)"
        ></OrderButton>
    </div>
  </div>
</CloseWrap>
</template>

<script>
import { mapGetters,mapActions,mapMutations } from 'vuex'
import { chargeWx, orderStatus } from '../../../fetch/api.js'
import * as statusCfg from '../../../config/statusCfg.js'              // 订单  生产状态配置
import CloseWrap from "../../../components/dialog/wrap/close.vue";
import orderButton from './orderButton.vue'                            // 订单  按钮


  export default {
    props: {
      orderId: {
        type: String,
        default: ''
      },
      orderInfo: {
        type: Object
      },
      // 是否显示排队队列
      showOrdersQueue: {
        type: Boolean
      }
    },
    data() {
      return {
        timerId: null,      // 定时器
        orderStates: {},    // 订单状态
        order: {}           // 订单信息
      }
    },
    computed: {
      ...mapGetters([
        'customer',
        'shop'
      ])
    },
    components: {
      CloseWrap,
      OrderButton: orderButton
    },
    created() {
      // this.order = this.orderInfo;

      let params = {orderId: this.orderId};
      orderStatus.customerNewOrder($.param(params)).then(res => {
        if (res.success == true && res.data) {
          this.order = res.data;
          // 显示等待队列
          if (this.order.orderState <= 2) {
            this.$emit('update:showOrdersQueue', true);
          }
        }
      })
      // 立即调用一次
      this.getOrderStates();
      // 轮询订单状态 
      if (this.order.orderState < 11) {
        this.timerId = setInterval(() => {
          this.getOrderStates();
        }, 3000)
      }
    },
    beforeDestroy() {
      // 清除定时器
      clearInterval(this.timerId);
      this.timerId = null;
    },
    methods: {
      chargeWx() {
        
      },
      getOrderStates() {
        let params = {orderId: this.orderId}
        orderStatus.getOrderStates($.param(params)).then(res => {
          if (res.statusCode === "200") {
            this.orderStates = res.data;
            this.order = {...this.orderInfo, ...this.orderStates};
          }
        })
      }
    },
    filters: {
      orderState(orderState) {
        if (orderState) {
          return statusCfg.order[orderState].txt;
        }
      }
    }
  }
</script>

<style lang="less">
  .new-order-wrap {
    .weui_dialog.shadow  {
      // height: 70vh;
    }
    .weui_dialog_hd {
      padding: 5px 10px;
      border-bottom: 1px solid #e5e5e5;
    }
    .dialog-title {
      position: relative;
      h2 {
        font-size: 1.2rem;
        font-weight: 500;
        text-align: left;
        height: 2rem;
        line-height: 2rem;
      }
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
        flex-wrap: wrap;
        box-sizing: border-box;
        > span {
          box-sizing: border-box;          
          background-color: #eee;
          padding: 4px 6px;
          border: 3px solid #fff; 
          margin: 4px 0;
          width: 33.3333%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .order-food-price {
        text-align: left;
        margin-top: 15px;
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
      text-align: left;
      // border-bottom: none;
      >.coder-txt {
        color: #868686;
        font-size: 1.1rem;
      }
      >.coder-num {
        color: #000;
        font-size: 1.5rem;
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
      // position: fixed;
      // z-index: 1;
      // width: 80%;
      // height: auto;
      // top: 5%;
      // left: 0;
      // right: 0;
      // margin: auto;
      // text-align: center;
      // background: #fff;
      // border-radius: 10px;
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
      bottom: 0;
      left: 0;
      line-height: 35px;
      display: flex;
      justify-content: space-around;
      // border-top: 1px solid #e5e5e5;
    }

    .weui_dialog_ft a.primary {
      flex: 1;
      margin: 6px;
      font-size: 1rem;
      background-color: #000;
      color: #fff;
      text-align: center;
      line-height: 35px;
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
