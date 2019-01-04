<template>
  <div>
    <!-- 显示多图列表的情况 -->
    <div v-if="currentArticle.recommendId || (list && list.length > 0)">
      <div class="weui_dialog_bd">
        <div class="form-group">
            <p><span class="meals-name">{{currentArticle.name}}</span></p>
        </div>
        <div class="meal-div" id="recommendImg" v-iscroll=getIscroll>
            <ul class="aatv" >
                <!--默认显示主品图片-->
                <li class="flex-container">
                  <!-- <div class="flex-item" style="background:url(http://106.14.44.167/group1/M00/04/1D/ag4sp1sjZ9mAJu0dAAA4Euu9ReQ548.jpg) no-repeat;background-size: 100% 100%;"></div> -->
                  <div class="flex-item" :style="{background: 'url('+currentArticle.photoSmall+')', backrgoundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"></div>
                </li>
                <!--推荐餐包图片-->
                <li v-for="(imgInfo, index) in list" class="flex-container">
                  <div class="flex-item" :style="{backgroundImage: 'url('+imgInfo.photoSmall+')', backrgoundRepeat: 'no-repeat', backgroundSize: '100% 100%'}"></div>
                </li>
            </ul>
            <div class="clearfix"></div>
        </div>
        <span class="article-likes">
          <img class="article-image" src="../../../../assets/img/red_heart.png" />
          <i>{{currentArticle.likes}}</i>
        </span>
      </div>
    </div>
    <!-- 显示单图 -->
    <div v-else>
      <div class="art-image" :style="{ backgroundImage: 'url('+currentArticle.photoSmall +')' }"></div>
      <span class="article-likes">
          <img class="article-image" src="../../../../assets/img/red_heart.png" />
          <i>{{currentArticle.likes}}</i>
        </span>
    </div>
  </div>
</template>

<script>
let iscrollObj = null;
export default {
  props: {
    currentArticle: {
      type: Object
    },
    list: {
      type: Array
    }
  },
  created() {

  },
  data() {
    return {
      iscrollConf: {
        scrollX : true
      }
    }
  },
  watch:{
    list:function (val) {
      if(val && val.length > 0) {
        if (iscrollObj) {
          iscrollObj.options.scrollX = true;
          iscrollObj.refresh();
        }
      }
    }
  },
  methods: {
    getIscroll(iscroll){
      if (iscroll) {
        iscrollObj = iscroll;
        iscrollObj.options.scrollX = true;
        iscrollObj.refresh();
        iscroll.on('scrollEnd', function() {
          // console.log("scrollEnd");
        });
      }
    },
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
    top: 5px;
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
  // 21
  ul, ol, li {
    list-style-type: none;
  }
  // 25
  li {
    color: #000;
    line-height: 20px;
    display: list-item;
    text-align: -webkit-match-parent;
  }
  // 831
  .dish_details .weui_dialog_bd {
      padding: 1px;
      box-sizing: border-box;
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

  // 2319
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
  // 2352
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
  // 2365
  .meals-name {
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
  // 4065
  .flex-container {
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: space-between;
      justify-content: space-between;
      width: 100%;
  }
</style>
