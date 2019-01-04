<template>
  <div id="cart-item-list">
    <div class="groupCartList" v-iscroll=getIscroll style="height: 215px;">
      <div>
        <!-- 后付 已下单菜列表 -->
        <LastCartItemList></LastCartItemList>
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
  </div>
</template>

<script>
import { mapGetters,mapMutations } from 'vuex'
import LastCartItemList from './lastCartItemList.vue'
let iscrollObj = null;
export default {
  
  computed: {
    ...mapGetters([
      // 'cartItem',
      'lastCartItem',
      'totalPrice'
    ])
  },
  watch: {
    
  },
  data() {
    return {
    }
  },
  components: {
    LastCartItemList
  },
  mounted() {
    // this.lastCartItem.push({})
    iscrollObj && iscrollObj.refresh();
  },
  methods: {
    getIscroll(iscroll){
      if (iscroll) {
        iscrollObj = iscroll;
        iscroll.on('scrollEnd', function() {
          console.log("scrollEnd");
        });
      }
    }
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
