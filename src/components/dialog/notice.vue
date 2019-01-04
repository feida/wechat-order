<template lang="html">
<CloseWrap  @close-dialog="$emit('update:noticeDialog', false)" v-if="noticeDialog">
  <div class="shop-notice" slot="content" @touchstart="start" @touchend="end">
    <div class="full-height" v-if="notice.noticeType==1||notice.noticeType==2">
      <div class="weui_dialog_bd">
        <img class="art-image" :src="notice.noticeImage"/>
      </div>
      <div class="weui_article article-desc">
        <div>
          <h3 class="article-name">{{notice.title}}</h3>
          <p class="article-desc">{{notice.content}}</p>
        </div>
      </div>
    </div>
    <div class="full-height" v-else>
      <div class="weui_dialog_bd big-image">
        <img class="big-image" :src="notice.noticeImage"/>
      </div>
    </div>
  </div>
</CloseWrap>
</template>

<script>
  import CloseWrap from './wrap/close.vue'
  import { appraiseCountApi } from '../../fetch/api'

  export default {
    props: {
      noticeDialog:{
        type: Boolean,
        default: false
      },
      noticeList: {
        type: Array
      }
    },
    data () {
      return {
        current: 0,           //左右滑动，当前索引
        startPoint: 0,
      }
    },
    computed: {
      notice() {
        return this.noticeList && this.noticeList[this.current] || {};
      }
    },
    components: {
      CloseWrap
    },
    created() {

    },
    methods:{
      close(){
        this.$emit("close-notice");
      },
      start(e){
        let touch = e.targetTouches[0];
        this.startPoint = touch.pageX;
      },
      end(e){
        let touch = e.changedTouches[0];
        let offset = this.startPoint - touch.pageX;
        if (offset > 30) {
          if (this.current < this.noticeList.length - 1) {
            this.current += 1;
            this.$emit('addNoticeHistory', this.current)
          }
        } else if (offset < -30) {
          if (this.current > 0) {
            this.current -= 1;
            this.$emit('addNoticeHistory', this.current)            
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
.shop-notice{
  height: 100%;
  .weui_dialog_bd {
    padding: 0;
    .art-image {
      height: 40vw;
      border-radius: 10px 10px 0 0;
      display: block;
    }
  }
  .article-desc {
    text-indent: 10px;
    text-align: left;
  }
  .big-image {
    height: 100%;
    padding: 1px;
    box-sizing: border-box;
  }
  .big-image>img {
    height: 100%;
    width: 100%;
    border-radius: 10px;
  }
  
}
</style>
