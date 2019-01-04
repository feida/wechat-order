<template>
  <!--查看购物车start-->
  <transition name="router-fade" mode="out-in">
    <div class="menu-cart">
      <div class="show-shop-cart" @click="showShopCart">
        <div class="weui-cell__bd">
          <img class="shopCartImg" :class="{jump:jump}" src="../../assets/img/shop_cart.png" />
          <span class="shopCartCount">
            <i class="art-count" v-if="totalNumber>0">{{totalNumber}}</i>
            <i class="art-count" :class="{artCount:totalNumber == 0}" v-if="totalNumber == 0"></i>
          </span>
          <span style="vertical-align: middle;margin-left:-1.6rem;" v-if="priceState">共计: ￥{{totalPrice.toFixed(2)}}元</span>
        </div>
        <div class="text-center" v-if="!priceState">
          <span>点击查看购物车</span>
        </div>
        <div class="weui-cell__bd">
          <div style="float: right;">
            <button type="button" class="weui-btn weui-btn_mini weui_btn_main order-ok"
              @click.stop="saveOrder" style="background-color: #000;line-height: 35px;font-size: 1rem;">点好了
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <!--查看购物车end-->
</template>

<script>
import { mapGetters,mapActions,mapMutations } from 'vuex'
import * as TYPE from '../../store/actionType/orderType'
  export default {
    props: {
      totalNumber: {
        type: Number
      },
      totalPrice: {
        type: Number
      },
      priceState:{
        type: Boolean
      }
    },
    watch:{
      totalNumber:function (val) {
        if(val){
          let that = this;
          this.jump = true;
          setTimeout(function () {
            that.jump = false;
          },300)
        }
      }
    },
    data () {
      return {
        jump:false
      }
    },
    computed: {
      ...mapGetters([
        'shop',
        'orderParams'
      ]),
    },
    created(){

    },
    methods:{
      showShopCart(){
        this.$emit("show-details");
      },
      saveOrder(){
        if (this.shop.allowFirstPay === 0) {  // 先付模式
          this.$emit("show-choice-mode");
        } else {
          // 直接挑战到下单页面 堂吃
          this.$store.commit(TYPE.SET_ORDER_PARAMS, {...this.orderParams, distributionModeId:1});
          this.$router.push({path: '/user/placeOrder'})
        }
      }
    }
  }
</script>

<style scoped>
  .menu-cart {
    position: fixed;
    bottom: 76px;
    width: 100%;
    font-size: 1rem;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .show-shop-cart {
    padding: 6px;
    color: #fff;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .shopCartImg {
    width: 28px;
    height: 28px;
    margin-left: 10px;
    vertical-align: middle;
    transition-property: all;
    transition-duration: .1s;
    transition-timing-function: linear;
    -webkit-transition-property:all;
    -webkit-transition-duration:.1s;
    -webkit-transition-timing-function:linear;
    -webkit-transform:scale(1,1);
    -moz-transform:scale(1,1);
    -transform:scale(1,1);
  }
  .menu-cart .art-count {
    height: 16px;
    width: 16px;
    font-size: 14px;
    border: 2px solid red;
    display: inline-block;
    border-radius: 50%;
    line-height: 16px;
    text-align: center;
    font-style: normal;
    color: #F9F5F5;
    background-color: red;
  }
  .artCount.art-count {
    height: 0px;
    width: 0px;
    border: initial;
  }
  .shopCartCount {
    position: relative;
    top: -6px;
    left: -15px;
  }
  .shopCartImg.jump {
    transition-property: all;
    transition-duration: .1s;
    transition-timing-function: linear;
    -webkit-transition-property:all;
    -webkit-transition-duration:.1s;
    -webkit-transition-timing-function:linear;
    -webkit-transform:scale(1.7,1.7);
    -moz-transform:scale(1.7,1.7);
    -transform:scale(1.7,1.7);
  }

</style>
