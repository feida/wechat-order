<template>
    <!-- 主界面使用 -->
    <span class="numberControl" :style="'color:'+color" v-if="!article.isEmpty">
      <template v-if="sceneType == 1">
        <span v-if="article.foodType==1 && article.count" @click.stop="cutArticle" class="cut-span"><i class="iconfont icon-jian-copy"></i></span>
        <span v-else></span>
        <span v-if="article.foodType==1 && article.count" class="art-number" >{{article.count ? article.count : ""}}</span>
        <span v-else></span>        
        <!-- 非单品只显示加号 -->
        <span class="plus-span" @click.stop="addArticle"><i class="iconfont icon-jiahao"></i></span> 
      </template>
      <template v-else-if="sceneType == 2">
        <span v-if="article.count" @click.stop="cutArticle" class="cut-span"><i class="iconfont icon-jian-copy"></i></span>
        <span v-else></span>        
        <span v-if="article.count" class="art-number" >{{article.count ? article.count : ""}}</span>
        <span v-else></span>        
        <!-- 非单品只显示加号 -->
        <span class="plus-span" @click.stop="addArticle"><i class="iconfont icon-jiahao"></i></span> 
      </template>
      <template v-else-if="sceneType == 3">
        <span v-if="article.count" @click.stop="cutArticle" class="cut-span"><i class="iconfont icon-jian-copy"></i></span>
        <span v-if="article.count" class="art-number" >{{article.count ? article.count : ""}}</span>
        <!-- 可编辑 -->
        <span v-if="(article.foodType == 1  && !article.recommendId) || article.foodType == 3" class="plus-span" @click.stop="addArticle"><i class="iconfont icon-jiahao"></i></span> 
        <span v-else class="edit-span" @click.stop="editArticle"><i class="iconfont icon-bianji"></i></span> 
      </template>
    </span>
    <span class="numberControl font-15" v-else>已售罄</span>
</template>

<script>
  import '../../../static/js/jquery.fly.min.js'
  export default {
    props: {
      article: {
        type: Object
      },
      //  1：我是单品；2：我是套餐；3：单品老规格；4：单品新规格；5：重量包；
      // foodType: {
      //   type: Number
      // }
      // 1: 主界面； 2：弹出层； 3：购物车列表
      sceneType: {
        type: Number,
        default: 2
      }
    },
    data() {
      return {
        color: '#333'
      }
    },
    created() {
      // 主界面的“-”“+”颜色背景图
      if (this.sceneType === 1) {
        this.color = this.article.controlColor;
      }
    },
    methods: {
      cutArticle(e){
         this.$emit("cut",this.article)
      },
      addArticle(e){
        // if (this.sceneType === 1 && this.article.foodType === 1 && !this.article.recommendId) {
        //   let that = this;
        //   let clickAnt = $("<span>1</span>");
        //   clickAnt.css({
        //     fontSize: "18px",
        //     padding: "0px 10px",
        //     backgroundColor: "#CDCDCD",
        //     color: "white",
        //     borderRadius: "50%",
        //     zIndex: 99999
        //   });
        //   let s = $(".flex-item").offset();
        //   let a = $(e.target).offset();
        //   let speed = 2 + 2 / (s.top - a.top) * 20;
        //   clickAnt.fly({
        //     start: {
        //       left: a.left,
        //       top: a.top
        //     },
        //     end: {
        //       left: s.left,
        //       top: s.top,
        //     },
        //     autoPlay: true,
        //     speed: speed,
        //     vertex_Rtop: a.top - 50,
        //     onEnd: function () {
        //       clickAnt.remove();
        //     }
        //   });
        // }
        this.$emit('add', this.article);
      },
      // 编辑
      editArticle() {
        this.$emit('edit', this.article);
      }
    }
  };
</script>

<style scoped>
  /* for ui主界面 样式 */
  .small-item .numberControl{
    width: 70px;
    position: absolute;
    bottom: 0.8rem;
    right: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
  }

  /* for ui购物车列表样式 */
  .group-item .numberControl {
    width: 70px;
    position: absolute;
    bottom: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
  }
  /* for other ui */
  .weui-cell__ft .numberControl {
    width: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
  }
  .numberControl {
    height: 26px;
  }
  .numberControl span {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .numberControl .iconfont {
    display: block;
    line-height: 1;
    font-size: 18px;
  }
  /* 加号大一些 */
  .numberControl .plus-span .iconfont, .numberControl .edit-span .iconfont {
    font-size: 26px;
  }
  /* .numberControl>span {
    padding: 0;
    display: block;
    float: left;
  } */
  /* .small-item .plus-span {
    padding-right: 10px;
    padding-top: 5px;
  } */
  /* .numberControl>span.cut-span {
    padding-top: 5px;
  }
  .numberControl>span.edit-span {
    padding-top: 5px; 
  }
  .numberControl .art-number {
    padding: 10px 8px 0px 8px;
    font-size: 18px;
  } */
  /* 2428 */
  /* .meals-edit {
    height: 22px;
    width: 22px;
    margin-top: 4px;
    line-height: 22px;
    text-align: center;

    display: inline-block;
    overflow: hidden;
    transform: translateY(3px);
  } */

</style>
