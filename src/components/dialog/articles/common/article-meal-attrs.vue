<template>
  <div>
  <div v-for="attr in currentArticle.mealAttrsChoose" class="weui_cells article-unit-list no-border-top no-border-bottom" style="margin-top: initial;">
    <div class="meal-attr-items" style="padding: inherit;">
        <div class="meal-items" style="padding: inherit;">
            <div class="form-group">
                <p><span>{{attr.name}}</span></p>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
    <div class="items-name-change">
      <div v-for="(item, key) in attr.mealItems" :key="key" class="meal-item-div">
        <span class="item-name-change" :class="{select: item.click}" style="overflow: initial;" @click="select(attr, item, key)">{{item.articleName}}+{{item.priceDif}}元</span>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import * as TYPE from '../../../../store/actionType/shopCartType'

export default {
  props: {
    currentArticle: {
      type: Object
    },
    // 1: 添加到购物车； 2： 编辑模式
    modeType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      mealAttrsChoose: []   //标记选中配菜
    }
  },
  watch: {
    // currentArticle: 
  },
  created() {
    this.mealAttrsChoose = this.currentArticle.mealAttrsChoose || []
  },
  methods: {
    // 选择类型 0：必选 ，具体根据 choice_count 的值来决定 必选几，不可多，不可少。——1：任选,可不选 
    select(attr, item, currKey) {
      // console.log(JSON.stringify(item));
      if (attr.choiceType == 0) {     //必选 并且和 choice_count一致
        if (item.click) {
          return;
        } else {
          // attr.mealItems.forEach(function(a){
          //   if(attr.currentItem[0].click == a.click){
          //     a.click = false;
          //   }
          // })
          // attr.currentItem = [];
          // attr.currentItem.push(item);
          // item.click = true;
          // 之前选中的随机改掉一个为false
          let choosePool = [];
          for (let i = 0; i<attr.mealItems.length; i++) {
            if (attr.mealItems[i].click == true && i != currKey) {
              choosePool.push(i);
            }
          }
          let randKey = Math.floor(choosePool.length * Math.random());
          attr.mealItems[choosePool[randKey]].click = false;
          attr.mealItems[currKey].click = true; 
        }
        
        attr.mealItems = [...attr.mealItems];
      }else{     //非必选 直接取反
        item.click = !item.click;
        attr.mealItems = [...attr.mealItems];
      }
      this.currentArticle.mealAttrsChoose = [...this.currentArticle.mealAttrsChoose];
      this.$store.commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: this.currentArticle});
//    this.$emit('select', info);
    }
  }
}
</script>

<style scoped lang="less">
// common.css line 102
.no-border-top:before {
  border-top: 0;
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

// 1757
.form-group {
    text-align: center;
}
// 1760
.form-group>p {
    color: #6e6e6e;
    position: relative;
}
// 1764
.form-group>p>span {
    background-color: #fff;
    padding: 0px 10px;
}
// 1768
.form-group>p:before {
    content: " ";
    display: block;
    border-top: 1px solid #a4a7b1;
    position: absolute;
    top: 50%;
    width: 100%;
    z-index: -1;
}
// 2378
.meal-attr-items {
  padding: 5px 10px;
  text-align: left;
}
// 2382
.meal-items {
  padding-bottom: 5px;
}
// 2385
.meal-items:last-child {
    border-bottom: 0px;
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
.items-name-change .meal-item-div:first-child {
  margin-top: 0px;
}

// 2409
.items-name-change .meal-item-div:nth-child(2) {
  margin-top: 0px;
}
// 2412
.items-name-change .meal-item-div:nth-child(3) {
  margin-top: 0px;
}

// 2415
.meal-item-div .item-name.select {
  background-color: #000;
  color: #fff;
}
// 2419
.meal-item-div .item-name-change.select {
    background-color: #000;
    color: #fff;
}
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
</style>
