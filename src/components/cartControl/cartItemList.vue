<template>
  <div>
    <div class="groupCartItem" v-for="food in cartItem" v-if="food.count > 0">
      <div v-if="food.foodType==1" class="weui_flex_cart order-item hidden name-col">
        <p class="cart-item-name">{{food.name}}</p>
        <!-- 单品的配餐 -->
        <p class="mini" v-if="food.recommendArticlesChoose">
          <template v-for="subA in food.recommendArticlesChoose" >
            <span :key="subA.articleId" v-if="subA.count && subA.count>0">{{subA.articleName}}X{{subA.count}}&nbsp;</span>
          </template>
        </p>
      </div>
      <!--套餐模式显示-->
      <div v-else-if="food.foodType==2" class="weui_flex_cart order-item hidden name-col">
        <p class="cart-item-name">{{food.name}}</p>
        <p class="mini">
          <template v-for="attr in food.mealAttrsChoose">
            <span v-for="(item, key) in attr.mealItems" v-if="item.click==true">{{item.articleName}}&nbsp;</span>
          </template>
        </p>
      </div>
      <!-- 单品老规格 -->
      <div v-else-if="food.foodType==3" class="weui_flex_cart order-item hidden name-col">
        <p class="cart-item-name">{{food.name}}{{food.unitTypeName}}
        </p>
      </div>
      <!-- 单品新规格 -->
      <div v-else-if="food.foodType==4" class="weui_flex_cart order-item hidden name-col">
        <p class="cart-item-name">{{food.name}}
          <template v-for="attr in food.unitListChoose">
            <span v-for="(item, key) in attr.details" v-if="item.click==true">({{item.name}})&nbsp;</span>
          </template>
        </p>
        <!-- 单品新规格的配餐 -->
        <p class="mini" v-if="food.recommendArticlesChoose">
          <template v-for="subA in food.recommendArticlesChoose" >
            <span :key="subA.articleId" v-if="subA.count && subA.count>0">{{subA.articleName}}X{{subA.count}}&nbsp;</span>
          </template>
        </p>
      </div>
      <!-- 重量包 -->
      <div v-else-if="food.foodType==5" class="weui_flex_cart order-item hidden name-col">
        <p class="cart-item-name">{{food.name}}
            <span v-for="(item, key) in food.weightListChoose.details" v-if="item.click==true">({{item.name}})&nbsp;</span>
        </p>
        <p class="mini" v-if="food.recommendArticlesChoose">
          <template v-for="subA in food.recommendArticlesChoose" >
            <span :key="subA.articleId" v-if="subA.count && subA.count>0">{{subA.articleName}}X{{subA.count}}&nbsp;</span>
          </template>
        </p>
      </div>
      <div class="weui_flex_cart price-col">
        <span class="price-style">￥{{(food.calcPrice * food.count).toFixed(2)}}</span>
      </div>
      <div class="weui_flex_cart group-item">
        <cartControl style="{color:food.controlColor}" v-if="food.count" :sceneType="3"
            :article="food" @add="addToShopCart" @cut="cutToShopCart" @edit="editArticle"></cartControl>
        <!-- <cartControl style="{color:food.controlColor}" v-if="food.peference"
            :article="food" @add="addToSingleShopCart" @cut="cutToSingleShopCart"></cartControl> -->
      </div>
    </div>
    <!-- <div class="groupCartItem total-price" v-if="sceneType==2">
      <div class="weui_flex_cart hidden">
        <span>总价</span>
      </div>
      <div class="weui_flex_cart food-price" style="text-align: right;">
        <span>&yen;{{totalPrice.toFixed(2)}}</span>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex'
import cartControl from './cartControl.vue'
// import articleDialog from '../../components/dialog/articles.vue'
// import LastCartItemList from './lastCartItemList.vue'
import * as TYPE from '../../store/actionType/shopCartType.js'
// let iscrollObj = null;
export default {
  props: {
    // 1：购物车列表, 2:placeOrder列表
    // sceneType: {
    //   type: Number,
    //   default: 1
    // },
    // orderBossId: {  // 判断是否是  后付的支付情况 
    //   type: String
    // }
  },
  computed: {
    ...mapGetters([
      'cartItem',
      // 'lastCartItem',
      'totalPrice'
    ])
  },
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
  data() {
    return {
      articleDialog: {show: false},
      currentArticle: null, 
      modeType: 1,                    //1:加入购物车模式； 2：编辑模式
      cartItemIndex: -1,              //编辑模式 编辑购物车索引id
    }
  },
  components: {
    // articleDialog,
    cartControl,
    // LastCartItemList
  },
  mounted() {
    // this.lastCartItem.push({})
    // iscrollObj && iscrollObj.refresh();
  },
  methods: {
    ...mapMutations([
      'addShopCart',
      'cutShopCart',
      'clearCartItem',
    ]),
    addToShopCart(a) {
      // a = {...a};
      // a.count = 1;
      // this.addShopCart(a);
      this.$emit('addToShopCart', a)
    },
    cutToShopCart(a) {
      // this.cutShopCart(a);
      this.$emit('cutToShopCart', a)
    },
    editArticle(a) {
      // a.modeType = 2;// 编辑模式
      // // this.$emit('showArticle', a);
      // this.showArticle(a);
      this.$emit('editArticle', a)
    },
    showArticle(a){
      // if (a.isEmpty ) {
      //   return;
      // };
      // // 没有推荐的单品直接加入购物车
      // if ( ! a.recommendId && a.foodType === 1 ) {
      //   return ;
      // }
      // // this.currentArticle = a;
      // if (a.modeType) {
      //   this.modeType = a.modeType;
      //   this.cartItemIndex = a.cartItemIndex >= 0 ? a.cartItemIndex : -1;
      // } else {
      //   this.modeType = 1;
      // }

      // a = {...a};
      // this.currentArticle = a;
      // // this.$store.commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: a});
      // this.$store.dispatch(TYPE.SET_CURRENT_ARTICLE, {currentArticle: a});
      // this.articleDialog.show = true;
    },
    // closeArticleDialog() {
    //   this.articleDialog.show = false;      
    // }
  }

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
