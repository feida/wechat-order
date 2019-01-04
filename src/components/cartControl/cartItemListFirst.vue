<template>
  <div id="cart-item-list">
    <div class="groupCartList" v-if="cartItem.length > 0 " v-iscroll=getIscroll style="height: 215px;">
      <CartItemList 
        @addToShopCart="addToShopCart"
        @cutToShopCart="cutToShopCart"
        @editArticle="editArticle"
      ></CartItemList>
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
// import * as TYPE from '../../store/actionType/shopCartType.js'
import CartItemListMixin from './cartItemListMixin.js'
// import LastCartItemList from './lastCartItemList.vue'
// let iscrollObj = null;
export default {
  mixins: [CartItemListMixin],
  // components: {
  //   LastCartItemList
  // }
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
