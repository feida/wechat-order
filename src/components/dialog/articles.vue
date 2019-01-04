<template>
  <div class="weui_article_alert article-wrap">
    <Articles1 v-if="foodType == 1" :currentArticle="currentArticle" @close-article="close" :modeType="modeType" :cartItemIndex="cartItemIndex"/>
    <Articles2 v-if="foodType == 2" :currentArticle="currentArticle" @close-article="close" :modeType="modeType" :cartItemIndex="cartItemIndex"/>
    <Articles3 v-if="foodType == 3" :currentArticle="currentArticle" @close-article="close" />
    <Articles4 v-if="foodType == 4" :currentArticle="currentArticle" @close-article="close" :modeType="modeType" :cartItemIndex="cartItemIndex"/>
    <Articles5 v-if="foodType == 5" :currentArticle="currentArticle" @close-article="close" :modeType="modeType" :cartItemIndex="cartItemIndex"/>
  </div>
</template>

<script>

  import Articles1 from './articles/articles-1.vue'
  import Articles2 from './articles/articles-2.vue'
  import Articles3 from './articles/articles-3.vue'
  import Articles4 from './articles/articles-4.vue'
  import Articles5 from './articles/articles-5.vue'


  import {
    mapGetters,
    mapActions,
    mapMutations
  } from 'vuex'
  import {
    articleListApi
  } from '../../fetch/api.js'
  export default {
    props: {
      currentArticle: {
        type: Object
      },
      // 1:加入购物车;2:编辑
      modeType: {
        type: Number,
        default: 1
      },
      //编辑模式 购物车中索引
      cartItemIndex: {
        type: Number,
        default: -1
      }
    },
    components: {
      Articles1,
      Articles2,
      Articles3,
      Articles4,
      Articles5,
    },
    data() {
      return {
        foodType: null,  //  1：我是单品；2：我是套餐；3：单品老规格； 4：单品新规格；5：重量包；
      }
    },
    created() {
      console.log(JSON.stringify(this.currentArticle.foodType));
      this.foodType = this.currentArticle.foodType;
    },
    methods: {
      close() {
        this.$emit("close-article");
      }
    }
  }
</script>
<style lang="less">
.article-wrap {
  position: fixed;
  width: 100vw;
  height: 100vh;
  // top: 0;
  // right: 0;
  // bottom: 0;
  // left: 0;
  z-index: 10;
  >.weui_article_alert {
    position: fixed;
    width: 100vw;
    height: 100vh;
    // top: 0;
    // right: 0;
    // bottom: 0;
    // left: 0;
    // z-index: 10;
    >.weui-mask {
      // width: 100vw;
      // height: 100vh;
      // z-index: 1000000;
      // top: 0;
    }
  }
}
</style>



