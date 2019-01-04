<template>
  <!-- 支付宝支付 提示页 -->
  <div class="alipay-wrap">
    <div style="text-align: right;">
      <img src="../../assets/img/alipayArrow.png" class="arrow"/>
    </div>

    <img v-if="isiOS==true" src="../../assets/img/safari.png" id="browserImg" class="browser"/>
    <img v-else src="../../assets/img/android_browser.png" id="browserImg" class="browser"/>

    <p v-if="isiOS==true" class="tips" id="iosTips" >点击微信右上角“...”，选择在Safari<br/>中打开，前往支付宝支付</p>
    <p v-else class="tips" id="androidTips" >点击微信右上角“...”，选择在浏览器<br/>中打开，前往支付宝支付</p>

    <div class="div_btns">
      <button class="btn" @click="toMyPage()">已支付完成</button>
        <button class="btn" @click="toMyPage()">取消并返回</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isiOS: false,
      orderId: null
    }
  },
  created() {
    // 不是微信内置浏览器
    this.orderId = this.$route.query.orderId || '';
    if(navigator.userAgent.toLowerCase().indexOf('micromessenger') == -1) {
      window.location.href = location.origin + "/wechat/pay/alipay?orderId=" + this.orderId;
    } else {
      // wx.ready(function(){
      //     //批量隐藏功能
      //     wx.hideMenuItems({
      //         menuList: ['menuItem:share:weiboApp','menuItem:share:QZone','menuItem:share:email','menuItem:share:brand',
      //             'menuItem:copyUrl','menuItem:originPage','menuItem:editTag','menuItem:delete','menuItem:share:facebook',
      //             'menuItem:favorite','menuItem:share:qq','menuItem:share:appMessage','menuItem:share:timeline','menuItem:exposeArticle']
      //     });
      // });
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      this.isiOS = isiOS;
    }
  },
  methods: {
    toMyPage() {
      this.$router.push({path: '/my', query:{}});
    }
  }
}
</script>

<style scoped lang="less">
.alipay-wrap {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: #F5F4F9;
  .arrow{
    width: 5rem;
    height: 5rem;
    position: relative;
    top: 5px;
    right: 10px;
  }
  .tips{
    font-size: 1.2rem;
    text-align: center;
    font-weight: bold;
    font-family: "微软雅黑";
    margin-top: 1rem;
    padding: 1rem;
  }
  .browser{
    width: 200px;
    height: 200px;
    display: block;
    margin: 0 auto;
  }
  .btn{
    background-color: #fff;
    border: 1px solid #0098E3;
    color: #0098E3;
    display: block;
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 16px;
    text-align: center;
    margin: 0 auto;
  }
  .div_btns {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-around;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0px 20px;
    margin-top: 1rem;
  }
  .btn-blue{
      background-color: #12A2E6;
      border-color: #12A2E6;
      color: #FFFFFF;
  }
  .btn-top {
    margin-top: 1rem;
  }
  @media screen and (min-width:374px){
    .tips {
      margin-top: 2rem;
    }
    .browser {
      margin-top: 1rem;
    }
    .div_btns {
      margin-top: 3rem;
    }
    .btn-top{
      margin-top: 2rem;
    }
  }
  @media screen and (min-width:400px){
    .tips {
      margin-top: 3rem;
    }
    .browser {
      margin-top: 2rem;
    }
    .div_btns {
      margin-top: 3rem;
    }
    .btn-top{
      margin-top: 3rem;
    }
  }
}

</style>
