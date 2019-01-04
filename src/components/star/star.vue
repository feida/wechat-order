<template>
  <div class="appraise-level appraise-level-transition" :class="[customClass]"> 
    <span v-for="n in 5" :key="n" @click="selectLevel(n)" :class="{'bad':txtKey>0 && txtKey<=4 && n<=txtKey, 'good':txtKey===5}"><i class="iconfont icon-star-full"></i></span>      
  </div>
</template>

<script>  
  export default {
    props: {
      currentSelect: {
        type: Number,
        default: 0
      },
      customClass: {
        type: String
      },
      // 0:评分界面；1：home界面
      scene: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        txtKey: 0,
      }
    },
    created() {
      this.txtKey = this.currentSelect;
    },
    methods: {
      selectLevel(index) {
        if (this.scene === 0) {
          this.txtKey = index;
          this.$emit('selectLevel', index);
        }
      }
    }
  };
</script>

<style lang="less">
// .comments-old {
  .appraise-level {
    font-size: 35px;
    margin-bottom: -10px;
    &.home {
      margin-left:3.5rem;
      margin-top: -2rem;
      > span >i {
        font-size: 1.4rem;  
      }
    }
    > span {
      // width: 40px;
        color: #f2f2f2;
      > i {
        font-size: 35px;
      }
      &.bad {
        color: #565656;
      }
      &.good {
        color: #C81624;
      }
    }
  }
// }
</style>
