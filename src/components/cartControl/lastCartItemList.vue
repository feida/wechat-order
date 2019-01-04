<template>
  <!-- 后付已下单菜品列表,由于lastCartItem与cartItem结构存在差异 
    这个组件部分逻辑和cartItemList.vue有点差异
  -->
  <div>
    <!-- 同时会有多个 可以继续选购的订单，只读取parentOrderId -->
    <div class="groupCartItem" v-for="food in lastCartItem" v-if="food.count > 0">
      <div v-if="food.foodType==1" class="weui_flex_cart order-item hidden name-col">
        <p class="cart-item-name">{{food.name}}</p>
        <!-- 单品的配餐 -->
        <p class="mini" v-if="food.recommendArticlesChoose">
          <!-- <template v-for="subA in food.recommendArticlesChoose" >
            <span :key="subA.articleId" v-if="subA.count && subA.count>0">{{subA.articleName}}X{{subA.count}}&nbsp;</span>
          </template> -->
          <template v-for="subA in food.recommendArticlesChoose" >
            <span :key="subA.articleId">{{subA.articleName}}X{{subA.count}}&nbsp;</span>
          </template>
        </p>
      </div>
      <!--套餐模式显示-->
      <div v-else-if="food.foodType==2" class="weui_flex_cart order-item hidden name-col">
        <p class="cart-item-name">{{food.name}}</p>
        <p class="mini">
          <span v-for="(item, key) in food.children" >{{item.articleName}}&nbsp;</span>
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
          <!-- <template v-for="attr in food.unitListChoose">
            <span v-for="(item, key) in attr.details" v-if="item.click==true">({{item.name}})&nbsp;</span>
          </template> -->
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
            <!-- <span v-for="(item, key) in food.weightListChoose.details" v-if="item.click==true">({{item.name}})&nbsp;</span> -->
        </p>
        <p class="mini" v-if="food.recommendArticlesChoose">
          <template v-for="subA in food.recommendArticlesChoose" >
            <span :key="subA.articleId" v-if="subA.count && subA.count>0">{{subA.articleName}}X{{subA.count}}&nbsp;</span>
          </template>
        </p>
      </div>
      <div class="weui_flex_cart price-col">
        <span class="price-style">￥{{(food.finalPrice).toFixed(2)}}</span>
      </div>
      <div class="weui_flex_cart group-item food-count">
        x{{food.count}}
        <!-- <cartControl style="{color:food.controlColor}" v-if="food.count" :sceneType="3"
            :article="food" @add="addToShopCart" @cut="cutToShopCart" @edit="editArticle"></cartControl> -->
        
      </div>
    </div>  
  </div>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex'
// import cartControl from './cartControl.vue'
// import articleDialog from '../../components/dialog/articles.vue'
// import * as TYPE from '../../store/actionType/shopCartType.js'
export default {
  
  computed: {
    ...mapGetters([
      'orderParams',
      'lastCartItem',
      // 'totalPrice'
      ])
  },
  data() {
    return {
    }
  },
  components: {
  },
  methods: {
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
  .food-count {
    color: #bbb;
  }
}
</style>
