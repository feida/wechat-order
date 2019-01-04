<template lang="html">
  <div class="weui_dialog_confirm" v-if="appraiseFilterDialog">
    <div class="weui-mask" @click="close"></div>
    <div class="weui_dialog_appraise">
      <div class="weui_dialog_hd">
        <strong class="weui_dialog_title">评分列表</strong>
      </div>
      <div class="weui_dialog_bd appraise-count-bd">
        <div class="full-height">
          <p v-for="count in countList">
            {{count.YEARMONTH}} 评论( {{count.COUNT}}条 {{count.AVG_SCORE.toFixed(2)}}分 )
          </p>
        </div>
      </div>
      <div class="weui-dialog__ft">
        <a class="weui-dialog__btn primary" @click="filter(5,5)">全部评价</a>
        <a class="weui-dialog__btn primary" @click="filter(4,4)">需要改进</a>
        <a class="weui-dialog__btn primary" @click="filter(0,3)">差评投诉</a>
      </div>
    </div>
  </div>
</template>

<script>
  import { appraiseCountApi } from '../../fetch/api'

  export default {
    props: {
      appraiseFilterDialog:{
        type: Boolean,
        default: false
      },
      countList:{
        type: Array
      }
    },
    data () {
      return {
        appraiseCount:{}
      }
    },
    created(){

    },
    methods:{
      close(){
        this.$emit("close-filter");
      },
      filter(min,max){
        this.$emit("filter-appraise",min,max);
        this.$emit("close-filter");
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/appraiseList.css';
</style>
