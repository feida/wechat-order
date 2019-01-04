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
      <div v-iscroll class="full-height">
        <!--菜品大图-->
        <div v-if="!currentArticle.recommendId">
          <div class="art-image" :style="{ backgroundImage: 'url('+currentArticle.photoSmall+')' }"></div>
          <span class="article-likes">
              <img class="article-image" src="../../../assets/img/red_heart.png" />
              <i>{{currentArticle.likes}}</i>
            </span>
        </div>
        <div style="padding: 0 10px;">
          <!-- 老规格描述文字 -->
          <div >
              <!--<h3 class="article-name">{{currentArticle.name}}</h3>-->
              <!--<div class="meal-attr-items" style="padding: inherit;">
                  <div class="meal-items" style="padding: inherit;">
                      <div class="form-group" style="color:#6E6E6E">
                          <p><span>餐品介绍</span></p>
                      </div>
                      <div class="clearfix"></div>
                  </div>
              </div>-->
              <div v-iscroll class="currentArticle-description">
                  <div>{{currentArticle.description}}</div>
              </div>
          </div>
          <!-- 单品老规格-->
          <CartItemCell v-for="item in currentArticle.articlePricesChoose" :key="item.name" :item="item" :currentArticle="currentArticle" @addNum="addToShopCart" @cutNum="cutToShopCart"></CartItemCell>
          
        </div>
          
        <div class="bottom-button">
          <div class="weui-dialog__ft">
            <a class="weui-dialog__btn white" @click="close">关闭</a>
            <a class="weui-dialog__btn primary" @click="joinShopCart">加入购物车</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import cartControl from '../../../components/cartControl/cartControl.vue'
  import CartItemCell from './common/cart-item-cell.vue'
  import * as TYPE from '../../../store/actionType/shopCartType'

  import {
    mapGetters,
    mapActions,
    mapMutations
  } from 'vuex'
  import {
    articleListApi
  } from '../../../fetch/api.js'
  export default {
    props: {
      // currentArticle: {
      //   type: Object
      // }
    },
    components: {
      cartControl,
      CartItemCell
    },
    data() {
      return {
        recommend: {}, // 推荐配餐
      }
    },
    computed: {
      ...mapGetters([
        // 'cartItem',
        'currentArticle',
        // 'currentRecommend',
        // 'currentUnit',
      ]),
    },
    created() {
      // console.log(JSON.stringify(this.currentArticle))
      // 子菜品 count重置为0
      // this.currentArticle.articlePricesChoose = this.currentArticle.articlePricesChoose.map(sub => {sub.count=0; return sub; });
      // this.$store.commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: {...this.currentArticle}});
    },
    methods: {
      ...mapMutations([
        'addShopCart',
        'cutShopCart'
      ]),
      close() {
        this.$emit("close-article");
      },
      // 监听加
      addToShopCart(subArticle) {
        // 只是修改显示数量
        // let subIndex = this.currentArticle.articlePricesChoose.findIndex(a => a.id === subArticle.id);
        // if (this.currentArticle.articlePricesChoose[subIndex].count) {
        //   this.currentArticle.articlePricesChoose[subIndex].count++;
        // } else {
        //   this.currentArticle.articlePricesChoose[subIndex].count = 1;
        // }
        this.currentArticle.articlePricesChoose = this.currentArticle.articlePricesChoose.map(a => {
          if (a.id === subArticle.id) {
            a = {...a}
            if (a.count) {
              a.count++;
            } else {
              a.count = 1;
            }
          }
          return a;
        }) 

        this.$store.commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: {...this.currentArticle}}); 
      },
      // 监听减
      cutToShopCart(subArticle) {
        // 只是修改显示数量
        this.currentArticle.articlePricesChoose = this.currentArticle.articlePricesChoose.map(a => {
          if (a.id === subArticle.id) {
            a = {...a}
            if (a.count && a.count >= 1) {
              a.count--;
            } else {
              a.count = 0;
            }
          }
          return a;
        }) 
      
        this.$store.commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: {...this.currentArticle}}); 
      },
      joinShopCart() {
        let flag = true;
        let count = 0;
        this.currentArticle.articlePricesChoose.forEach(subA => count += subA.count || 0);
        if (count === 0) {
          flag = false;
        }
        if (!flag) {
          this.$kiko_message({
            isShow: true,
            message: '您还未选择菜品哦!',
            time: 2000,
            type: 2
          })
          return;
        }
        let article = {...this.currentArticle};
        // 选中的每个规格，都是单独一条购物车记录
        this.currentArticle.articlePricesChoose.forEach(sub => {
          if (sub.count && sub.count > 0) {
            // 标记规格被选中
            article.subArticleId = sub.id; // 老规格子菜品 唯一id
            article.count = sub.count;
            article.price = sub.price;
            article.unitTypeName = sub.name;//规格名称
            article.stockWeekend = sub.stockWeekend;
            article.stockWorkingDay = sub.stockWorkingDay;
            // article.unitInfo = sub
            article.unitIds = sub.unitIds
            this.addShopCart(article);
          }
        })

        this.$emit("close-article");
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
.currentArticle-description {
  font-size: 0.875rem;
  color: #6E6E6E;
  line-height: 1.25rem;
  max-height: 58px;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
}

</style>
