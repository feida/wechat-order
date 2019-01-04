<template>
<!-- 抽象组件 -->
  <div class="weui_dialog_confirm sencond_mask close-dialog-wrap">
    <div class="weui_mask" @click="$emit('close')"></div>
    <slot></slot>
  </div>  
</template>

<script>
export default {
  // props: {
  //   dialogType: {
  //     type: String
  //   }
  // },
  mounted() {
    // close-dialog-wrap
    // 阻止滑屏冒泡
    $(".close-dialog-wrap").bind("touchstart", function(event){
      event.stopPropagation();
    })
  }
}
</script>

<style lang="less">
.close-dialog-wrap {
  .weui_mask {
    position: fixed;
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .weui_dialog {
    position: fixed;
    z-index: 1;
    width: 80%;
    // height: auto;
    height: 120vw;
    top: 5%;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    background: #fff;
    border-radius: 10px;
  }
}

</style>
