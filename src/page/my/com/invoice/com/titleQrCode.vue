<template>


  <div class="codeInfo">
    <!-- <img class="codeImg" alt="二维码" src="http://test02.restoplus.cn/wechat/receipt/qrcode?content=test餐加&amp;width=250&amp;height=250"> -->
    <qrcode value="test餐加" class="myCodeSrc"></qrcode>
    <p>抬头二维码</p>
  </div>
    
</template>

<script>
  import qrcode from '@xkeshi/vue-qrcode'
  export default {
    components: {
      qrcode
    }
  };
</script>

<style lang="less">
.codeInfo {
  position: fixed;
  bottom: 30px;
  text-align: center;
  width: 90%;
  margin: 25px 5%;
  padding: 4% 0;
  border-top: 1px dashed #999999;
}
</style>
