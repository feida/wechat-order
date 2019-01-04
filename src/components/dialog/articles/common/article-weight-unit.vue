<template>
  <div v-if="calcWeight">
  <div class="weui_cells article-unit-list no-border-top no-border-bottom" style="margin-top: initial;">
    <div class="meal-attr-items" style="padding: inherit;">
        <div class="meal-items" style="padding: inherit;">
            <div class="form-group">
                <p><span>{{calcWeight.name}}</span></p>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
    <div class="items-name-change" >
      <div  v-for="(subItem, subkey) in calcWeight.details" :key="subkey" class="meal-item-div">
        <span class="item-name-change" :class="{select: subItem.click}" style="overflow: initial;" @click="select(subkey)">{{subItem.name}}</span>
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
    // weight: {
    //   type: Object
    // }
  },
  components: {
  },
  computed:{

  },
  created() {
    this.calcWeight = this.currentArticle.weightListChoose
  },
  data() {
    return {
      calcWeight: {}
    }
  },
  methods: {
    select(key) {
      // this.calcWeight = this.weight;
      if (this.calcWeight.details[key].click && this.calcWeight.details[key].click === true) {
        // 依然选中
      } else {
        // vuex相关，数据改动时尽量用map，不要用forEach
        this.calcWeight.details = this.calcWeight.details.map((u, index) => {
          u = {...u};
          u.click = false;
          if (key == index) {
            u.click = true;
          }
          return u;
        })
      }
      let currentArticle = this.currentArticle;
      currentArticle.weightListChoose = {...this.calcWeight}
      this.$store.commit(TYPE.SET_CURRENT_ARTICLE, {currentArticle: currentArticle})
      this.$emit('selectWeight');
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
