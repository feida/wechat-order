<template>
  <a class="weui-dialog__btn primary save-button" :class="{disabled: btnStatus===false}">

    <template v-if="shop.shopMode != 6">
      <span 
        @click="createOrder('pay')" v-if="shop.shopMode != 5">买单
      </span>
    </template>
    <!-- 大boss模式 -->
    <template v-else>
      <!-- 堂食 或者外带需要扫码的时候  未扫码进入店铺  则显示当前状态为需要扫码下单 -->
      <span v-if="parentId == null && distributionModeId == 1 && tableNumber == null"
        @click.stop="penScan">扫码下单
      </span>
      <span v-if="parentId == null && distributionModeId == 3 && tableNumber == null && shop.continueOrderScan == 1"
        @click.stop="penScan">扫码下单
      </span>
      <span v-if="parentId == null && distributionModeId == 3 && tableNumber == null && shop.continueOrderScan == 0"
        @click.stop="createOrder('pay')">买单
      </span>
        <span v-if="parentId == null && distributionModeId == 3 && tableNumber != null && shop.continueOrderScan == 1"
        @click.stop="createOrder('pay')">买单
      </span>
      <span v-if="parentId == null && shop.allowAfterPay == 1 && shop.allowFirstPay ==0 && distributionModeId == 1 && tableNumber!=null"
        @click.stop="createOrder('pay')">买单
      </span>
      <span v-if="parentId == null && shop.allowAfterPay == 0 && shop.allowFirstPay ==1 && distributionModeId == 1 && tableNumber!=null && orderBoss.orderState >= 2 && orderBoss.orderState != 9"
        @click.stop="createOrder('pay')">买单
      </span>
      <span v-if="parentId == null && shop.allowAfterPay == 0 && shop.allowFirstPay ==1 && distributionModeId == 1 && tableNumber!=null "
        @click.stop="createOrder('buy')">下单
      </span>
      <!-- 没有传递orderBossId -->
      <template v-if="orderBossId == null">
        <!-- 加菜 -->
        <span v-if="parentId != null && firstPayType == 0"  
          @click.stop="createOrder('pay')">买单
        </span>
        <span v-if="parentId != null && firstPayType == 1 && orderBoss.orderState >= 2 && orderBoss.orderState != 9"  
          @click.stop="createOrder('pay')">买单
        </span>
        <span v-if="parentId != null && firstPayType == 1 && orderBoss.orderState == 1"
          @click.stop="createOrder('buy')">下单
        </span>
      </template>
      <!-- 传了orderBossId index.html line2036-->
      <template v-else>
        <span v-if="orderBoss.payType == 0 && orderBoss.orderState == 1 && orderBoss.productionStatus == 0 && orderBoss.payMode == 1" 
          @click.stop="payBossOrder('pay')">立即支付</span>
        <span v-if="orderBoss.payType == 1 && orderBoss.orderState == 1 && orderBoss.isPay != 11 && orderBoss.allowContinueOrder && orderBoss.payMode != 3 && orderBoss.payMode != 4 && orderBoss.payMode != 5 && orderBoss.payMode != 6"
          @click.stop="payBossOrder('pay')">买单</span>
        <span v-if="orderBoss.payType == 1 && orderBoss.isPay == 11 && (orderBoss.payMode != 1 || orderBoss.payMode != 2) && orderBoss.orderState == 1"
          @click.stop="payBossOrder('pay')">买单</span>
        <span v-if="orderBoss.payType == 1 && (orderBoss.payMode == 0 || orderBoss.payMode == 1 || orderBoss.payMode == 2) && orderBoss.orderState == 1 && !orderBoss.allowContinueOrder"
          @click.stop="payBossOrder('pay')">买单</span>
        <span v-if="orderBoss.payType == 1 && (orderBoss.payMode == 3 || orderBoss.payMode == 4) && orderBoss.orderState == 1">请等待服务员</span>
        
      </template>
        <!-- 外带是否需要扫码 (不需要)  扫码进是否堂食(需选择就餐模式) 的时候显示 -->
      <span v-if="parentId == null && distributionModeId == 3 && shop.continueOrderScan == 0 && shop.sweepMode == 1 && shop.allowAfterPay == 1 && shop.allowFirstPay == 0 && tableNumber != null"
        @click.stop="createOrder('pay')">买单
      </span>
      <span v-if="parentId == null && distributionModeId == 3 && shop.continueOrderScan == 0 && shop.sweepMode == 1 && shop.allowAfterPay == 0 && shop.allowFirstPay == 1 && tableNumber != null" 
        @click.stop="createOrder('buy')">下单
      </span>
      <span v-if="distributionModeId == 2"
          @click.stop="createOrder('pay')">买单
      </span>

      
    </template>
  </a>
  
</template>

<script>
import { mapGetters,mapActions,mapMutations } from 'vuex'
import * as TYPE from '../../../store/actionType/orderType'
import { wxConfigApi, rulesList } from '../../../fetch/api.js'
import Utils from '../../../utils/utils.js'
import wx from 'weixin-js-sdk'
export default {
  props: {
    // 主订单id
    parentId: {
      type: String
    },
    //
    orderBossId: {
      type: String
    },
    // 就餐模式
    distributionModeId: {
      type: Number
    },
    // 桌号
    // tableNumber: {
    //   type: Number,
    //   default: null
    // },
    //
    firstPayType: {
      type: Number|String,
      default: null
    },
    orderBoss: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      btnStatus: true,  // 防止按钮重复点击
      // tableNumber: null,
    }
  },
  computed: {
    ...mapGetters([
      'customer',
      'shop',
      'orderParams'
    ]),
    tableNumber() {
      if (this.orderParams.tableNumber) {
        return this.orderParams.tableNumber;
      } else {
        return null;
      }
    },
    buttonType() {

    }
  },
  created() {
    if (this.tableNumber === null && this.parentId === null) {
      // console.log('ok')
    } else {
      // console.log('abc', this.tableNumber)
    }
  },
  methods: {
    // 扫码参数
    // orderParams:{"tableNumber":5,"customerId":"0fe51f33acb242b69963baa44fc237d9","distributionModeId":1,"useAccount":true,"orderItems":[{"articleId":"4132005228484fca946d33738060586f","count":1,"type":1,"discount":100},{"articleId":"c87bc689a57040f5a8a728b6259f6605@253","count":1,"type":2,"discount":100}],"waitMoney":0,"waitId":null,"servicePrice":0,"mealFeePrice":0,"mealAllNumber":0,"beforeId":null,"paymentAmount":0,"memberDiscountMoney":0,"groupId":null,"payType":1}
    // 继续选购参数
    // orderParams:{"tableNumber":"5","parentOrderId":"9d0bb1c933ef41dc8aedf60e60c1842c","verCode":"2238","customerId":"0fe51f33acb242b69963baa44fc237d9","distributionModeId":1,"useAccount":true,"orderItems":[{"articleId":"670231c8950e46d984dbff9e240bc748","count":1,"type":1,"discount":100},{"articleId":"99a463ba70034e87ae23547df34bec27","count":1,"type":1,"discount":100}],"waitMoney":0,"waitId":null,"servicePrice":0,"mealFeePrice":0,"mealAllNumber":0,"beforeId":null,"paymentAmount":0,"memberDiscountMoney":0,"payType":1}
    // 扫码
    penScan() {
      let cb = async (data) => {
        try {
          let shopId = null;
          let tableNumber = null;
          let shop = this.shop;
          if (shop.isNewQrcode == 0) {// 新版二维码
            var reg_allNumber = /^[\d]+$/;
            var reg_tableNumber = /tableNumber=[\d]+/;              
            if (reg_allNumber.test(data)) {
              tableNumber = data;
            } else if (reg_tableNumber.test(data)) {
              tableNumber = data.match(reg_tableNumber)[0].match(/[\d]+/)[0];
            }
            var reg_shopId = /shopId=[a-zA-Z0-9]+/;
            if (reg_shopId.test(data)) {
              shopId = data.match(reg_shopId)[0].split("=")[1];
            }
          } 
          var reg_vv = /vv=[-.-_A-Za-z0-9]+/;
          if (reg_vv.test(data)) {
            let param = {id: data.match(reg_vv)[0].split("=")[1]}; 
            let res = await rulesList.getTable($.param(param)); 
            if (res && res.success==true) {
              if (res.data.shopDetailId != shop.id) {
                throw new Error(shop.id + "该二维码与门店信息不符！" + JSON.stringify(res))
              }
              shopId = res.data.shopDetailId;
              tableNumber = res.data.tableNumber;
            } else {
              throw new Error("该二维码无效！")
            }
          }
          if (shopId == null || tableNumber == null) {
            throw new Error("未识别改格式的数据:" + data)
          }     
          // alert(shopId+'-'+tableNumber)  
          // this.tableNumber = tableNumber;
          // 修改订单参数
          this.$store.commit(TYPE.SET_ORDER_PARAMS, {...this.orderParams, ...{tableNumber: tableNumber}});
        } catch (e) {
          alert(e.message)
        }
      }
      this.scanTableNumber(cb);
    },
    // 扫码 微信接口
    async scanTableNumber(cb) {
      try {
        // 测试环境
        if (process.env.NODE_ENV === 'development') {
        // if (true) {
          // 修改订单参数
          return this.$store.commit(TYPE.SET_ORDER_PARAMS, {...this.orderParams, ...{tableNumber: 1}});
        }
        // 微信权限验证
        await Utils.wxConfig()
        wx.ready(function() {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              // alert(result)
              cb && cb(result);
            },
            error:function(res) {
                if(res.errMsg.indexOf('function_not_exist') > 0){
                    alert('版本过低请升级')
                }
            }
          });
        })
      } catch (e) {
        alert(e.message)
      }
    },
    // type: buy:下单(后付) pay：买单（先付）
    createOrder(type) {
      if (this.btnStatus === true) {  
        this.btnStatus = false;
        this.$emit('createOrder', type);
        setTimeout(()=> {
          this.btnStatus = true;
        }, 5000)
      }
    },
    // 保留老代码中的方法名
    payBossOrder() {
      this.createOrder('pay')
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
.save-button {
  span {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
