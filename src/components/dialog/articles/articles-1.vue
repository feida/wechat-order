<template>
  <!-- 
    单品 弹出组件暂时废弃 （不用弹出）
  1：我是单品；
  2：我是套餐；
  3：单品老规格； 
  4：单品新规格；
  5：重量包；
  -->
  <div class="weui_article_alert">
    <div class="weui-mask" ></div>
    <div class="weui_dialog" style="border: 1px solid #fff;">
      <div class="full-height">
        <!--菜品大图|推荐图-->
        <ArticleImg :currentArticle="currentArticle" :list="imgList"></ArticleImg>
        <div class="scroll-wrap" v-iscroll=getIscroll style="height:284px; overflow:hidden;">
          <div style="padding: 0 10px;">
            <!-- 推荐配餐 -->
            <ArticleRecommend v-if="currentArticle.recommendArticlesChoose" :currentArticle="currentArticle" @select="select"></ArticleRecommend>
          </div>
        </div>
        <div class="bottom-button">
          <div class="weui-dialog__ft weui_dialog_ft">
            <a class="weui-dialog__btn white" @click="close">关闭</a>
            <a class="weui-dialog__btn primary" @click="joinShopCart">加入购物车</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import cartControl from '../../../components/cartControl/cartControl.vue'
  import ArticleImg from './common/article-img.vue'
  import ArticleRecommend from './common/article-recommend.vue'
  import CartItemCell from './common/cart-item-cell.vue'
  import { getRecommendImgList, checkRecommendCount, autoScroll } from '../articles.js'
  import * as TYPE from '../../../store/actionType/shopCartType'
  import {
    mapGetters,
    mapActions,
    mapMutations
  } from 'vuex'
  import {
    articleListApi
  } from '../../../fetch/api.js'
  let iscrollObj = null;
  export default {
    props: {
      // currentArticle: {
      //   type: Object
      // },
      // 1: 添加到购物车； 2：编辑模式
      modeType: {
        type: Number,
        default: 1
      },
      // 编辑模式传递
      cartItemIndex: {
        type: Number,
        default: -1
      }
    },
    components: {
      // cartControl,
      ArticleRecommend,
      CartItemCell,
      ArticleImg,
    },
    data() {
      return {
        
      }
    },
    computed: {
      ...mapGetters([
        'currentArticle',
      ]),
      imgList() {
        return getRecommendImgList(this.currentRecommend);
      }
    },
    created() {
    },
    methods: {
      ...mapMutations([
        'addShopCart',
        'cutShopCart',
        'editShopCart'
      ]),
      close() {
        this.$emit("close-article");
      },
      addToShopCart() {
        this.addShopCart(this.currentArticle);
      },
      cutToShopCart() {
        this.cutShopCart(this.currentArticle);
      },
      joinShopCart() {
        let article = {...this.currentArticle};
        // 判断是否配餐最大最小购买数量
        if ( ! checkRecommendCount(this, this.currentArticle)) {
          return;
        }
        if (this.modeType === 1) {
          this.addShopCart(article);
        } else if (this.modeType == 2) {
          this.editShopCart({currentArticle: article, cartItemIndex: this.cartItemIndex});
        }
        this.$emit("close-article");
      },
      getIscroll(iscroll){
        let _this = this;
        if (iscroll) {
          iscrollObj = iscroll;
          iscroll.on('scrollEnd', function() {
            console.log("scrollEnd");
          });
        }
      },
      select() {
        autoScroll(iscrollObj);
      }
    }
  }
</script>

<style lang="less" scoped>
  // .art-image {
  //   height: 40vw;
  //   border-radius: 10px 10px 0 0;
  //   display: block;
  //   background-size: 100% 100%;
  // }
  // .article-likes {
  //   position: absolute;
  //   top: 15px;
  //   right: 0;
  //   background-color: rgba(255, 255, 255, 0.8);
  //   padding: 0 5px;
  //   border-radius: 5px 0 0 5px;
  //   color: #C81623;
  // }
  // .article-image {
  //   width: 15px;
  //   height: 15px;
  //   vertical-align: middle;
  // }
  // .cart-item-name {
  //   width: 150px;
  // }
  // .form-group {
  //   text-align: center;
  // }
  /*.bottom-button {*/
  /*position: absolute;*/
  /*bottom: 0;*/
  /*width: 100%;*/
  /*}*/
  /*.weui-dialog__ft a.white {*/
  /*background-color: #fff;*/
  /*color: #000;*/
  /*text-align: center;*/
  /*border: 1px solid #868686;*/
  /*}*/
  /*.weui-dialog__ft a.primary {*/
  /*background-color: #000;*/
  /*color: #fff;*/
  /*text-align: center;*/
  /*}*/
  /*.weui-dialog__ft {*/
  /*line-height: 35px;*/
  /*font-size: 17px;*/
  /*}*/
  /*.weui-dialog__ft a {*/
  /*margin: 10px;*/
  /*border-radius: 5px;*/
  /*position: relative;*/
  /*}*/
.weui_dialog {
  overflow: hidden;
}
.weui_dialog_ft {
  line-height: 35px;
  background-color: #fff;
}
</style>
