<template>
  <!-- <div class="weui_dialog_confirm"> -->
  <!-- 后付的“立即支付”页面 -->
  <div>
    <!-- <div class="weui-mask"></div> -->
    <div class="place-order-wrap">
      <div class="full-height">
        <!--订单菜品明细-->
        <div class="weui-cell header_table">
          <div class="weui-cell__bd">
            <p>共计{{totalOrderNumber}}份菜品</p>
          </div>
        </div>
        <CartItemListPay></CartItemListPay>
        <!--底部 小项列表-->
        <div class="bottom-button bottom-box">
          <div class="weui-cells page__category-content ">
            <a v-if="shop.orderRemarkShow == false" class="weui-cell weui-cell_access js_item" href="javascript:;">
                <div class="weui-cell__bd" @click="showOrderRemark">
                    <p>订单备注 </p>
                    <p class="remark-txt" v-if="remarkTxt.length>0">{{remarkTxt}}</p>
                    <p class="prefer" v-if="remarkTxt.length === 0">口味、偏好等</p>
                </div>
                <div class="weui-cell__ft"></div>
            </a>
            <!-- <a class="weui-cell weui-cell_access js_item" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>就餐模式<span v-if="orderParams.tableNumber" class="table-number">桌号：{{orderParams.tableNumber}}</span></p><p class="mode-type">{{orderParams.distributionModeId | modeType}}</p>
                </div>
            </a> -->
            <a class="weui-cell weui-cell_access js_item" :class="{'events-none': eventsNone}" href="javascript:;"  >
                <div class="weui-cell__bd">
                    <p>可用余额 <span class="balance">&yen;{{customer.account}}</span></p>
                </div>
                <!-- <div class="weui-cell__ft"> -->
                  <!-- <label for="switchCP" class="weui-switch-cp"> -->
                      <input id="switchCP" class="weui-switch-cp__input" type="checkbox" v-model="useAccount" >
                      <div class="weui-switch-cp__box" @click.stop="switchUseAccount"></div>
                  <!-- </label> -->
                <!-- </div> -->
            </a>
            <chargeRules :chargeList="chargeList" v-if="chargeList.length"></chargeRules>
            <!--<a class="weui-ce ll weui-cell_access js_item" href="javascript:;" @click="rechargeFlag=true">-->
                <!--<div class="weui-cell__bd">-->
                    <!--<p>充值赠送</p>-->
                    <!--<p class="charge-btn-box">-->
                      <!--<a v-for="(item,key) in rulesList" v-if="key <= 1" href="javascript:;" class="weui_btn weui_btn_mini charge-btn colorFix" >{{item.labelText}}</a>-->
                    <!--</p>-->
                <!--</div>-->
                <!--<div class="weui-cell__ft"></div>-->
            <!--</a>-->
            <a v-if="orderParams.mealFeePrice>0" class="weui-cell weui-cell_access js_item" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>餐盒费</p><p class="final-price"><span v-if="memberActivityByTelephone.discount" class="weui-badge badge-box" style="margin-left: 5px;">{{memberActivityByTelephone.discount}}折</span>&yen;{{orderParams.mealFeePrice}}</p>
                </div>
                <div class="weui-cell__ft"></div>
            </a>
            <a v-if="listCoupon.length > 0" class="weui-cell weui-cell_access js_item" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>可用优惠</p>
                    <p class="" style="width: 70%;">
                      <select class="weui-select" name="select1" v-model="couponId">
                        <option v-for="item in listCoupon" :value="item.id" :key="item.id">{{item.name}} &yen;{{item.value}}</option>
                      </select>
                    </p>
                </div>
                <div class="weui-cell__ft"></div>
            </a>
            <a v-if="articleFree.articleId" class="weui-cell weui-cell_access js_item" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>抵扣菜品
                        <span class="balance">{{articleFree.articleName}}</span>
                    </p>
                    <p class="final-price">&yen;{{articleFree.deductMoney.toFixed(2)}}</p>
                </div>
                <div class="weui-cell__ft"></div>
            </a>
            <a class="weui-cell weui-cell_access js_item" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>实付金额 <span class="origin-price">原价&nbsp;&yen;{{totalMoney.toFixed(2)}}</span></p><p class="final-price"><span v-if="memberActivityByTelephone.discount" class="weui-badge badge-box" style="margin-left: 5px;">{{memberActivityByTelephone.discount}}折</span>&yen;{{pay.toFixed(2)}}</p>
                </div>
                <div class="weui-cell__ft"></div>
            </a>
          </div>
          <!-- 口味、偏好 -->
          <!-- <orderRemark v-if="orderRemarkFlag" :orderRemarkList="shop.orderRemarkList" :userRemarkTxt="remarkTxt" @close="closeOrderRemark"></orderRemark> -->
          <orderRemark v-if="orderRemarkFlag" 
            :userRemarkTxt="remarkTxt" 
            @close="closeOrderRemark"></orderRemark>
          <!-- 充值 -->
          <recharge v-if="chargeDialog" 
            :chargeList="chargeList" ></recharge>
          <!-- 第三方支付 -->
          <payThird v-if="payThirdFlag" 
            :orderBossId="orderBossId" 
            :lastOrder="lastOrder" 
            :price="price"
            :pay="pay"
            @closePayThird="payThirdFlag=false"></payThird>
        </div>
        <!-- button -->
        <div class="weui-dialog__ft">
          <a class="weui-dialog__btn white" @click="close" v-if="!lastOrder.id || (lastOrder.distributionModeId==1 && lastOrder.allowContinueOrder)">继续点单</a>
          <!-- <a class="weui-dialog__btn  weui-btn weui-btn_disabled weui-btn_default" v-else>继续点单</a> -->
          <SaveButton
            :parentId="parentOrderId"
            :orderBossId="orderBossId"
            :distributionModeId="orderParams.distributionModeId"
            :tableNumber="orderParams.tableNumber"
            :firstPayType="lastOrder.payType"
            :orderBoss="lastOrder"
            @createOrder="createOrder" @penScan="penScan"></SaveButton>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
//shopMode 2:电视叫号 3:验证码 6:boss模式 超级模式 先付 后付
import { rulesList, chargeWx, customerApi, orderStatus } from '../../fetch/api.js'
import CartItemListPay from '../../components/cartControl/cartItemListPay'
import placeMixin from './placeMixin.js'
// import PlaceItems from './placeItems.vue'
export default {
  mixins: [placeMixin],
  components: {
    CartItemListPay,
    // PlaceItems  
  },
  computed: {
    // 菜品总价+餐盒费+服务费
    totalMoney() {
      // 1+3种情形
      // 1.先付
      // 2.后付-第一次
      // 3.后付-继续选购
      // 4.后付-立即支付（不会加上购物车里的钱）
      let totalMoney = 0;
      // 总价 
      // 后付-“立即支付”
      totalMoney =  this.lastOrder.amountWithChildren || this.lastOrder.orderMoney || 0;
      return totalMoney;
    },
  },
  async created() {
    // orderBossId
    this.orderBossId = this.$route.query.orderBossId || null;
    if (!this.orderBossId) {
      this.$router.push({path:'/user/order'});
    }
    this.setLastCartItem(this.orderBossId);
  },
  methods:{
    // 客户端foodtype定义 1：我是单品；2：我是套餐；3：单品老规格； 4：单品新规格；5：重量包；
    // 服务端type定义 1：无规格单品，2：老规格单品，3：套餐主品，4:套餐的子菜 5：新规格单品 6:推荐配餐 8：重量包
    // let params = {orderArray: '{"customerId":"51e57b47f51348819dd4c22208ff61a2","distributionModeId":1,"useAccount":true,"orderItems":[{"articleId":"d3d84fefcb334dc59be708ab2d3e3bf6","count":1,"type":1,"discount":100}],"waitMoney":0,"waitId":null,"servicePrice":0,"mealFeePrice":0,"mealAllNumber":0,"beforeId":null,"paymentAmount":0,"memberDiscountMoney":0.15000000000000002,"memberDiscount":0.85,"groupId":null,"payType":0}'};
    // 下单：只是saveOrder 买单：saveOrder+支付 | 后付模式则调用payAfter
    async createOrder(type) {
      try {
        if (type === 'pay') {  // 买单
          if (this.orderBossId && this.shop.allowAfterPay == 0) {    // 后付模式
            if (this.pay === 0.00) {
              let params = {
                orderId: this.lastOrder.id,
                couponId: this.couponId,
                price: this.price,      // 系统内的金额(是计算属性)
                pay: this.pay,          // 第三方需要支付的钱(是计算属性)
                waitMoney: 0,           // 已废弃
                payMode: 0              // 支付方式：余额
              };
              let res = await orderStatus.afterPay($.param(params));
              if (!res.success) throw new Error(res.message)
              // 清空购物车|后付模式
              this.$store.commit('clearLastCartItem');
              this.$store.commit('clearCartItem');
              // 刷新余额
              this.$store.dispatch('getCustomer', {code: ''});
              // 刷新优惠券
              this.$store.dispatch('SET_LIST_COUPON_BY_STATUS');
              // 跳转到我的页面
              this.$router.push({ path: '/user/my', query:{orderid: this.lastOrder.id}});
            } else {
              // 第三方支付
              this.payThirdFlag = true;
            }
          }
        }
      } catch(e) {
        this.$kiko_message({
          isShow: true,
          message: e.message,
          time: 2000,
          type: 2
        })
      }
    },
  }
}
</script>
