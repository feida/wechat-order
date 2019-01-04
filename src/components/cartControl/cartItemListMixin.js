import { mapGetters,mapMutations } from 'vuex'
import cartControl from './cartControl.vue'
import articleDialog from '../../components/dialog/articles.vue'
// import LastCartItemList from './lastCartItemList.vue'
import CartItemList from './cartItemList.vue'
import * as TYPE from '../../store/actionType/shopCartType.js'
let iscrollObj = null;
export default {
  components: {
    articleDialog,
    cartControl,
    CartItemList
    // LastCartItemList
  },
  computed: {
    ...mapGetters([
      'cartItem',
      'lastCartItem',
      'totalPrice'
    ])
  },
  watch: {
    "cartItem": {
      handler: function(newVal, oldVal) {
        if (newVal.length > 0) {
          iscrollObj && iscrollObj.refresh();
        }
      },
      immediate: true
    },
      
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
    },
    ...mapMutations([
      'addShopCart',
      'cutShopCart',
      'clearCartItem',
      
    ]),
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
      // this.$emit('showArticle', a);
      this.showArticle(a);
    },
    showArticle(a){
      if (a.isEmpty ) {
        return;
      };
      // 没有推荐的单品直接加入购物车
      if ( ! a.recommendId && a.foodType === 1 ) {
        return ;
      }
      // this.currentArticle = a;
      if (a.modeType) {
        this.modeType = a.modeType;
        this.cartItemIndex = a.cartItemIndex >= 0 ? a.cartItemIndex : -1;
      } else {
        this.modeType = 1;
      }

      a = {...a};
      this.currentArticle = a;
      // this.$store.commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: a});
      this.$store.dispatch(TYPE.SET_CURRENT_ARTICLE, {currentArticle: a});
      this.articleDialog.show = true;
    },
    closeArticleDialog() {
      this.articleDialog.show = false;      
    }
  }

}