<template>
  <!-- 选择抬头列表 抬头为空的情况 -->
    <div class="successInfo">
      <p>{{tips}}</p>
    </div>
</template>

<script>
  export default {
    props: {
      tips: String
    }
  }
</script>

<style lang="less">
// .title-list-empty {
  .successInfo {
    position: relative;
    top: 35%;
    text-align: center;
    color: #848484;
  }
// }
</style>
