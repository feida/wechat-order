<template>
  <!-- 
  1：我是单品；
  2：我是套餐；
  3：单品老规格； 
  4：单品新规格；
  5：重量包；
  6：单品推荐包；
  -->
  <div class="weui_article_alert">
    <div class="weui-mask"></div>
    <div class="weui_dialog" style="border: 1px solid #fff;">
      <div class="full-height">
        <!--菜品大图-->
        <ArticleImg :currentArticle="currentArticle" :list="imgList"></ArticleImg>
        <div class="scroll-wrap" v-iscroll=getIscroll style="height:284px; overflow:hidden;">
          <div style="padding: 0 10px;">
            <!--单品新规格-->
            <CartItemCell v-if="currentArticle.count >= 1" :key="currentArticle.name" :item="currentArticle" :unitList="currentArticle.unitListChoose" :currentArticle="currentArticle" @addNum="addToShopCart" @cutNum="cutToShopCart"></CartItemCell>
            <!--口味 份量 -->
            <ArticleNewUnit v-if="currentArticle.unitListChoose" :currentArticle="currentArticle" @selectUnit="selectUnit"></ArticleNewUnit>
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
  import CartItemCell from './common/cart-item-cell.vue'
  import ArticleImg from './common/article-img.vue'
  import ArticleNewUnit from './common/article-new-unit.vue'
  import ArticleRecommend from './common/article-recommend.vue'
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
    components: {
      // cartControl,
      ArticleNewUnit,
      ArticleRecommend,
      CartItemCell,
      ArticleImg
    },
    props: {
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
    data() {
      return {
        // selected: false,
        // currentUnit: null, //规格配置，选中后需要缓存
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
        // 只是修改显示数量
        this.currentArticle.count++;
        this.$store.commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: {...this.currentArticle}});        
      },
      cutToShopCart() {
        // 只是修改显示数量
        this.currentArticle.count--;
        this.$store.commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: {...this.currentArticle}});       
      },
      joinShopCart() {  
        let flag = true;
        this.currentArticle && this.currentArticle.unitListChoose && this.currentArticle.unitListChoose.forEach(item => {
          if (item.details.findIndex(unit => unit.click === true) === -1) {
            flag = false;
          }
        });
        if (!flag) {
          this.$kiko_message({
            isShow: true,
            message: '您还未选择菜品规格哦!',
            time: 2000,
            type: 2
          })
          return;
        }    
      
        let article = {...this.currentArticle};
        // 判断是否配餐最大购买数量
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
      selectUnit() {
        if (this.currentArticle.count <= 0) {
          this.currentArticle.count = 1; //未加入购物车，默认数量1
          this.$store.commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: {...this.currentArticle}});
        }
      },
      getIscroll(iscroll) {
        let _this = this;
        if (iscroll) {
          iscrollObj = iscroll;
          iscroll.on('scrollEnd', function() {
            console.log("scrollEnd");
          });
        }
      },
      select() {
        // 添加推荐 自动滑动
        autoScroll(iscrollObj);
      }
    }
  }
</script>

<style lang="less" scoped>
  .art-image {
    height: 40vw;
    border-radius: 10px 10px 0 0;
    display: block;
    background-size: 100% 100%;
  }
  .article-likes {
    position: absolute;
    top: 15px;
    right: 0;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 0 5px;
    border-radius: 5px 0 0 5px;
    color: #C81623;
  }
  .article-image {
    width: 15px;
    height: 15px;
    vertical-align: middle;
  }
  .cart-item-name {
    width: 150px;
  }
  .form-group {
    text-align: center;
  }
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
// 822
.weui_dialog .weui_article {
    min-height: 30vw;
    text-align: left;
    padding: 0px 15px;
}
.weui_dialog {
    position: fixed;
    z-index: 1001;
    width: 80%;
    top: 5%;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    background: #fff;
    border-radius: 10px;
}

// 1619
.weui_dialog .weui_cells {
  background: none;
}

// 1623
.weui_cells {
  margin-top: 0.82em;
  font-size: inherit;
}
// 1739 
.item-name-change {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: #eee;
    display: inline-block;
    width: 100%;
    line-height: 7vw;
    height: 7vw;
    border-radius: 5px;
}
// 2396
.items-name-change .meal-item-div {
    float: left;
    position: relative;
    text-align: center;
    background-color: #eee;
    width: 31%;
    margin-top: 5px;
    border-radius: 5px;
    margin-left: 5px;
}
// 2406
// .items-name-change .meal-item-div:first-child {
//     margin-top: 0px;
// }
// 2683
.items-name-change {
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-top: 5px;
}
.weui_dialog {
  overflow: hidden;
}
.weui_dialog_ft {
  line-height: 35px;
  background-color: #fff;
}

</style>
