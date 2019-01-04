<template>
  <div>
    <div class="weui-mask" style="background: rgba(0, 0, 0, 0.5);" @click="closeCart"></div>
    <div class="shopcart-list" id="cart_item_container" :class="{move:show,out:!attention}">
      <div class="full-height" >
        <div class="weui-cell header_table" id="head_title">
          <div class="weui-cell__bd" style="text-align: left;">
            <span>共计已选<i style="color: #C81623;font-weight: bold;">{{totalNumber ? totalNumber : 0}}</i>份菜品</span>
          </div>
          <div class="weui-cell__ft" @click="showClearShopCart">
            <img class="clearGroupImg" src="../../assets/img/clearGroup.png" />
            <span>清空购物车</span>
          </div>
        </div>
        <div class="groupCartList" v-if="cartItem.length == 0">
          <img class="emptyShopCartImg" src="../../assets/img/emptyShopCart.png"/>
          <p style="padding-bottom: 30px;">暂无菜品，请添加菜品~</p>
        </div>
          <CartItemListFirst></CartItemListFirst>
        <!-- </div> -->
        <shopCart :totalNumber="totalNumber" :totalPrice="totalPrice" :priceState="priceState" @show-choice-mode="showChoiceMode"></shopCart>
        <Confirm :isShow.sync="isShowConfirm" @confirm="clearShopCart" @closeToast="closeConfirm"></Confirm>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters,mapMutations } from 'vuex'
  import cartControl from '../../components/cartControl/cartControl.vue'
  import shopCart from '../../components/shopCart/shopCart.vue'
  import Confirm from '../../components/Global/packages/confirm/src/confirm.vue'
  import CartItemListFirst from '../cartControl/cartItemListFirst.vue'              // 购物车列表组件
  export default {
    props: {
      cartItem: {
        type: Array
      },
      totalNumber: {
        type: Number
      },
      totalPrice: {
        type: Number
      },
      priceState:{
        type: Boolean,
        default: false
      },
      detailsShow:{
        type: Boolean
      }
    },
    data(){
      return {
        show: true,
        attention: true,
        isShowConfirm: false,
      }
    },
    components: {
      cartControl,
      shopCart,
      Confirm,
      CartItemListFirst
    },
    created(){

    },
    mounted() {
      let _this = this;
      setTimeout(function () {
        _this.resetCartListHeight();
      },1000)
    },
    computed: {
      
    },
    methods:{
      ...mapMutations([
        'addShopCart',
        'cutShopCart',
        'clearCartItem'
      ]),
      closeCart(){
        let that = this;
        this.attention = false;
        setTimeout(function () {
          that.show = false;
          that.attention = true;
          that.$emit("show-details");
        }, 500)
      },
      showClearShopCart() {
        this.isShowConfirm = true;
      },
      clearShopCart() {
        this.clearCartItem();
        this.isShowConfirm = false;
      },
      closeConfirm() {
        this.isShowConfirm = false;
      },
      addToShopCart(a) {
        a = {...a};
        a.count = 1;
        this.addShopCart(a);
      },
      cutToShopCart(a) {
        this.cutShopCart(a);
      },
      editArticle(a) {
        a.modeType = 2;// 编辑模式
        this.$emit('showArticle', a);
      },
      showChoiceMode(){
        this.closeCart();
        this.$emit("show-mode");
      },
      getIscroll(iscroll){
        if (iscroll) {
          iscroll.on('scrollEnd', function() {
            console.log("scrollEnd");
          });
        }
      },
      resetCartListHeight() {
        let fullHeight = $("#cart_item_container");
        let head_title = $("#head_title");
        let menucart = $(".menu-cart");
        let groupCartList = $(".groupCartList");
        console.log(fullHeight.height(),head_title.height(), menucart.height());
        groupCartList.height(fullHeight.height() - head_title.height() - menucart.height()-16);
        groupCartList.css({
          overflow: "hidden",
          position: "relative"
        });
      },
    }
  }
</script>

<style scoped>
  .shopcart-list {
    left: 0;
    right: 0;
    bottom: -50vh;
    width: 100%;
    height: 300px;
    z-index: 1000;
    position: fixed;
    text-align: center;
    color: rgb(0, 0, 0);
    font-family: 微软雅黑;
    font-size: 14px;
    margin: 0 auto;
    background: rgb(255, 255, 255);
  }
  .weui-cell.header_table {
    position: relative;
    background-color: #e0e0e0;
    padding: 8px 15px;
    box-sizing: content-box;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  /*.groupCartList {*/
    /*text-align: center;*/
    /*font-size: 1.1rem;*/
  /*}*/
  /*.groupCartItem:last-child {*/
    /*border-bottom: none;*/
  /*}*/
  /*.groupCartItem {*/
    /*padding: 10px 15px;*/
    /*position: relative;*/
    /*display: -webkit-box;*/
    /*display: -webkit-flex;*/
    /*display: flex;*/
    /*-webkit-box-align: center;*/
    /*-webkit-align-items: center;*/
    /*align-items: center;*/
    /*color: #000;*/
    /*border-bottom: 1px solid #e7e7e7;*/
  /*}*/
  /*.price-style {*/
    /*position: absolute;*/
    /*left: 53%;*/
    /*color: #c41e24;*/
  /*}*/
  /*.weui_flex_cart {*/
    /*-webkit-box-flex: 1;*/
    /*-webkit-flex: 1;*/
    /*flex: 1;*/
    /*text-align: center;*/
  /*}*/
  /*.group-item {*/
    /*position: relative;*/
  /*}*/
  /*.group-item .numberControl {*/
    /*position: absolute;*/
    /*top: -20px;*/
    /*right: 0;*/
  /*}*/
  .emptyShopCartImg {
    width: 5rem;
    height: 5rem;
    padding-top: 30px;
  }
  .clearGroupImg {
    width: 1.3rem;
    height: 1.3rem;
    vertical-align: middle;
  }
  .shopcart-list .menu-cart {
    bottom: 0;
  }
  .shopcart-list .shopCartImg {
    margin-left: -45px;
  }

  .shopcart-list.move {
    animation:mymove .5s;
    -webkit-animation:mymove .5s; /*Safari and Chrome*/
    animation-iteration-count:1;
    -webkit-animation-iteration-count:1; /* Safari 和 Chrome */
    animation-fill-mode:forwards;
    -webkit-animation-fill-mode:forwards;
    animation-timing-function:linear;
    -webkit-animation-timing-function:linear;
  }
  @keyframes mymove {
    from {bottom:-50vh;}
    to {bottom:0;}
  }
  @-webkit-keyframes mymove /*Safari and Chrome*/{
    from {bottom:-50vh;}
    to {bottom:0;}
  }
  .shopcart-list.out {
    animation:myout .5s;
    -webkit-animation:myout .5s;
    animation-iteration-count:1;
    -webkit-animation-iteration-count:1;
    animation-fill-mode:forwards;
    -webkit-animation-fill-mode:forwards;
    animation-timing-function:linear;
    -webkit-animation-timing-function:linear;
  }
  @keyframes myout {
    from {bottom:0;}
    to {bottom:-50vh;}
  }
  @-webkit-keyframes myout {
    from {bottom:0;}
    to {bottom:-50vh;}
  }
  /* 799 */
  .order-item .mini {
    color: #bbb;
    font-size: 0.7em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* 835 */
  .cart-item-name {
    font-size: 16px;
  }
  .name-col {
    flex-basis: 24%;
  }
  .price-col {
    position: static;
    text-align: left;
  }
</style>
