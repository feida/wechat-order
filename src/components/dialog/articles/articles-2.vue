<template>
  <!--
  1：我是单品；
  2：我是套餐；
  3：单品老规格；
  4：单品新规格；
  5：重量包；
  6：单品推荐包；
  -->
  <div class="weui_article_alert" style="position:relative;">
    <div class="weui-mask" ></div>
    <div class="weui_dialog" style="border: 1px solid #fff;">
      <div class="full-height">
        <ArticleImg :currentArticle="currentArticle" :list="imgList"></ArticleImg>
        <div class="dish_size_bg meals-wrap" v-iscroll style="height:284px; overflow:hidden;">
          <!-- 套餐属性 -->
          <ArticleMealAttrs :currentArticle="currentArticle" :modeType="modeType"></ArticleMealAttrs>
        </div>
        <div class="bottom-button">
            <div class="weui_dialog_ft margin-top-0 no-border-top">
                <a class="meals-price price">{{totalPrice}}/{{currentArticle.unit}}</a>
                <a class="weui_btn_dialog primary" @click="joinShopCart">确定</a>
            </div>
        </div>
      </div>
      <div class="dialog-close" @click="close"><i class="iconfont icon-jiaochacross80"></i></div>
    </div>
  </div>
</template>

<script>
  import cartControl from '../../../components/cartControl/cartControl.vue'
  import ArticleImg from './common/article-img.vue'
  import CartItemCell from './common/cart-item-cell.vue'
  import ArticleMealAttrs from './common/article-meal-attrs.vue'
  import * as TYPE from '../../../store/actionType/shopCartType'
  import {
    mapGetters,
    mapActions,
    mapMutations
  } from 'vuex'

  export default {
    props: {
      // 1: 添加到购物车； 2： 编辑模式
      modeType: {
        type: Number,
        default: 1
      },
      cartItemIndex: {
        type: Number,
        defualt: -1
      }
    },
    components: {
      cartControl,
      ArticleMealAttrs,
      ArticleImg
    },
    data() {
      return {
        // imgList: [],
        totalPrice: 0,
      }
    },
    computed: {
      ...mapGetters([
        'currentArticle',
      ]),
      imgList() {
        let imgList = [];
        let totalPrice = 0;
        this.currentArticle && this.currentArticle.mealAttrsChoose && this.currentArticle.mealAttrsChoose.forEach(attr => {
          attr.mealItems.forEach(item => {
            if (item.click === true) {
              imgList.push(item);
              totalPrice += item.priceDif || 0;
            }
          })
        })
        // + 主菜价格
        totalPrice += this.currentArticle.fansPrice || this.currentArticle.price || 0;
        // 折扣
        this.totalPrice = totalPrice * this.currentArticle.discount / 100;
        return imgList;
      }
    },
    async created() { 
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
      joinShopCart() {
        if (this.modeType === 1) {
          this.addShopCart(this.currentArticle);
        } else if (this.modeType == 2) {
          this.editShopCart({currentArticle: this.currentArticle, cartItemIndex: this.cartItemIndex});
        }
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
  .meal-div {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding: 0px 5px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 18vw;
  }
  .aatv {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    height: inherit;
    position: absolute;
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-text-size-adjust: none;
    -moz-text-size-adjust: none;
    -ms-text-size-adjust: none;
    -o-text-size-adjust: none;
    text-size-adjust: none;
  }
  .flex-container {
    display: flex;
    flex-direction: row;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .flex-item {
    margin: 0px 4px;
    width: 24vw;
    height: 15vw;
    border-radius: 8px;
  }
  .meals-name{
    color: #000;
      font-size: 15px;
      font-weight: bold;
      text-align: center;
      padding: 5px 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      display: block;
      word-break: keep-all;
      border-radius: 10px;
  }
  .meal-attr-items{
    padding: 5px 10px;
    text-align:left;
  }
  .meal-items{
    padding-bottom:5px;
  }
  .meal-items:last-child{
    border-bottom:0px;
  }
  .attr-title{
    font-weight: bold;
  }
  .item-name {
    display: inline-block;
    padding: 0px 5px;
    background-color: #eee;
    margin: 0px 2px 2px 0px;
  }
  .items-name::after {
    content: '';
    display: block;
    clear: both;
  }
  .items-name .meal-item-div{
    float:left;
    position: relative;
    text-align: center;
  }
  .items-name-change .meal-item-div{
    float:left;
    position: relative;
    text-align: center;
    background-color: #eee;
    width: 31%;
    margin-top: 5px;
    border-radius: 5px;
    margin-left: 5px;
  }
  .items-name-change .meal-item-div:first-child {
    margin-top: 0px;
  }
  .items-name-change .meal-item-div:nth-child(2) {
    margin-top: 0px;
  }
  .items-name-change .meal-item-div:nth-child(3) {
    margin-top: 0px;
  }
  .meal-item-div .item-name.select{
    background-color: #000;
    color: #fff;
  }
  .meal-item-div .item-name-change.select{
    background-color: #000;
    color: #fff;
  }
  .weui_dialog .weui_dialog_ft a.meals-price{
    text-align: left;
    font-size: .9em;
    color: #000;
  }
  .meals-edit{
    height: 26px;
    width: 26px;
    margin-top: 4px;
    line-height: 26px;
    text-align: center;
    border: 2px solid;
    border-radius: 50%;
    display: inline-block;
  }
  .dish_size_bg.meals-wrap{
    border-top:0;
  }
  .article-likes{
    position: absolute;
    top: 15px;
    right: 0px;
    background-color: rgba(255,255,255,0.8);
    padding: 0px 5px;
    border-radius: 5px 0px 0px 5px;
    color: #C81623;
  }
  .form-group {
    text-align: center;
  }

  .dialog-close {
    position: absolute;
    display: block;
    color: #fff;
    padding-top: 10px;
    width: 100%;
    z-index: 1;
    text-align: center;
  }
  .dialog-close i {
    font-size: 4em;
  }
  // 874
  .weui_dialog .weui_dialog_ft a {
    flex: 1;
    margin: 10px;
    border-radius: 5px;
    position: relative;
  }
  // 933
  .weui_dialog_ft {
    display: flex;
    line-height: 35px;
  }
  // 936
  .weui_dialog_ft a.primary {
    background-color: #000;
    color: #fff;
    text-align: center;
  }
  // 2192
  .bottom-button {
    position: absolute;
    bottom: 0px;
    width: 100%;
  }
  // 2423
  .weui_dialog .weui_dialog_ft a.meals-price {
    text-align: left;
    font-size: .9em;
    color: #000;
  }

  // common.css line15
  .margin-top-0 {
    margin-top: 0px;
  }
</style>
