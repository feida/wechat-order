<template>
  <div class="weui-cell" style="padding: 5px 0;">
    <div class="weui-cell__bd text-left">
      <p v-if="currentArticle.foodType == 3" class="cart-item-name">{{currentArticle.name}}{{item.name}}</p>      
      <p v-else-if="currentArticle.foodType == 4" class="cart-item-name" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{item.name}}
        <template v-for="attr in unitList">
          <span v-for="(item, key) in attr.details" v-if="item.click==true">({{item.name}})&nbsp;</span>
        </template>
      </p>
      <p v-else class="cart-item-name">{{item.name || item.articleName}}</p>
      <p class="font-mini">
        <template v-if="item.fansPrice">
          <span class="price delete">{{item.price}}元</span>
          &nbsp;&nbsp;
          <span class="price sale">{{item.fansPrice}}元</span>
        </template>
        <span class="price sale" v-else>{{item.price}}元</span>
      </p>
    </div>
    <div class="weui-cell__ft">
      <!-- 单品老规格 有子article列表 -->
      <cartControl v-if="currentArticle.foodType == 3" :article="item" @add="add" @cut="cut" :seceneType="2"></cartControl>
      <!-- 重量包不显示加减 -->
      <div v-else-if="currentArticle.foodType == 5"><!--不用显示--></div>
      <cartControl v-else :article="currentArticle" @add="add" @cut="cut" :seceneType="2"></cartControl>
    </div>
  </div>
</template>

<script>
import cartControl from '../../../../components/cartControl/cartControl.vue'
export default {
  props: {
    currentArticle: {
      type: Object
    },
    item: {
      type: Object
    },
    unitList: {
      type: Array
    }
  },
  components: {
    cartControl
  },
  data() {
    return {

    }
  },
  mounted() {
    // console.log(this.currentArticle)
  },
  methods: {
    add(article) {
      this.$emit('addNum', article);
    },
    cut(article) {
      this.$emit('cutNum', article);
    }
  }
}
</script>

<style scoped lang="less">
.cart-item-name {
  // width: 150px;
}
.form-group {
  text-align: center;
}
.sale {
  color: #C81623;
}
</style>
