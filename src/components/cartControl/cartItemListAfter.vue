<template>
  <div id="cart-item-list">
    <div class="groupCartList" v-if="cartItem.length > 0 || lastCartItem.length > 0" v-iscroll=getIscroll style="height: 215px;">
      <div>
        <!-- 购物车中列表（可 加减 编辑） -->
        <CartItemList 
          @addToShopCart="addToShopCart"
          @cutToShopCart="cutToShopCart"
          @editArticle="editArticle"
        ></CartItemList>
        <!-- 后付 已下单列表 -->
        <LastCartItemList ></LastCartItemList>
        <!-- <div class="groupCartItem total-price" v-if="sceneType==2">
          <div class="weui_flex_cart hidden">
            <span>总价</span>
          </div>
          <div class="weui_flex_cart food-price" style="text-align: right;">
            <span>&yen;{{totalPrice.toFixed(2)}}</span>
          </div>
        </div> -->
      </div>
    </div>
    <!-- article组件 -->
    <articleDialog 
    v-if="articleDialog.show"
    @close-article="closeArticleDialog" 
    :currentArticle="currentArticle" 
    :modeType="modeType" 
    :cartItemIndex="cartItemIndex"></articleDialog>
  </div>
</template>

<script>
// import { mapGetters,mapMutations } from 'vuex'
// import cartControl from './cartControl.vue'
// import articleDialog from '../../components/dialog/articles.vue'
// import CartItemList from './cartItemList.vue'
import LastCartItemList from './lastCartItemList.vue'
import CartItemListMixin from './cartItemListMixin.js'
// import * as TYPE from '../../store/actionType/shopCartType.js'
// let iscrollObj = null;
export default {
  components: {
    LastCartItemList
  },
  mixins: [CartItemListMixin],
  // computed: {
  //   ...mapGetters([
  //     'cartItem',
  //     'lastCartItem',
  //     'totalPrice'
  //   ])
  // },
  watch: {
    // "cartItem": function(newVal, oldVal) {
    //   if (newVal.length > 0) {
    //     iscrollObj && iscrollObj.refresh();
    //   }
    // },
    // "lastCartItem": {
    //   handler: function(newVal, oldVal) {
    //     if (newVal.length > 0) {
    //       this.$nextTick(() => {
    //         iscrollObj && iscrollObj.refresh();
    //       })
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
}
</script>

<style lang="less">
#cart-item-list {
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
  .total-price {
    // border-top: 1px solid #e7e7e7;
    padding-bottom: 3.2rem;
  }
}
</style>
