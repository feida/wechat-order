<template>
  <!-- <div class="weui_dialog_confirm"> -->
  <!-- 电视机叫号模式 下单页-->
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
        <CartItemListFirst></CartItemListFirst>
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
            <a class="weui-cell weui-cell_access js_item" href="javascript:;">
                <div class="weui-cell__bd">
                    <p>就餐模式<span v-if="orderParams.tableNumber" class="table-number">桌号：{{orderParams.tableNumber}}</span></p><p class="mode-type">{{orderParams.distributionModeId | modeType}}</p>
                </div>
            </a>
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
                    <p>实付金额 <span class="origin-price">原价&nbsp;&yen;{{totalPriceOrigin.toFixed(2)}}</span></p><p class="final-price"><span v-if="memberActivityByTelephone.discount" class="weui-badge badge-box" style="margin-left: 5px;">{{memberActivityByTelephone.discount}}折</span>&yen;{{pay.toFixed(2)}}</p>
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
import CartItemListFirst from '../../components/cartControl/cartItemListFirst.vue'  //购物车列表组件
import placeMixin from './placeMixin.js'
// import PlaceItems from './placeItems.vue'
//shopMode 2:电视叫号 3:验证码 6:boss模式 超级模式 先付 后付
export default {
  mixins: [placeMixin],
  components: {
    CartItemListFirst,
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
      totalMoney = this.totalPrice;      
      // 加上服务费
      totalMoney += (this.shop.servicePrice || 0);
      //外带情况 + 餐盒费
      if (this.orderParams.distributionModeId == 3) {
        totalMoney += (this.orderParams.mealFeePrice || 0);
      }

      return totalMoney;
    }
  },
  async created() {
    // 购物车为空回跳
    if (!this.cartItem || this.cartItem.length === 0) {    
      this.$router.replace({ path: '/user/order'});
    }
    
    // 初始化下单参数
    this.setOrderParams();
  }
}
</script>
