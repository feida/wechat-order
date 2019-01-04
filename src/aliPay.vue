<template>
  <div id="ali" class="alipay-wrap" v-if="isMicroMessage">
    <div style="text-align: right;">
      <img src="./assets/img/alipayArrow.png" class="arrow"/>
    </div>

    <img v-if="isiOS" src="./assets/img/safari.png" class="browser"/>
    <img v-else src="./assets/img/android_browser.png" class="browser"/>

    <p v-if="isiOS" class="tips" id="iosTips" >点击微信右上角“...”，选择在Safari<br/>中打开，前往支付宝支付</p>
    <p v-else class="tips" id="androidTips" >点击微信右上角“...”，选择在浏览器<br/>中打开，前往支付宝支付</p>

    <div class="div_btns">
      <button class="btn" @click="toMyPage">已支付完成</button>
      <button class="btn" @click="toMyPage">取消并返回</button>
    </div>
  </div>
</template>

<script>
import Utils from './utils/utils.js'

export default {
  name: 'ali',
  data () {
    return {
      isMicroMessage: true,
      isiOS: false,
      orderId: null
    }
  },
  created(){
    if(navigator.userAgent.toLowerCase().indexOf('micromessenger') == -1) {
      this.isMicroMessage == false;
    }
  },
  mounted() {
    // 不是微信内置浏览器
    this.orderId = Utils.getUrlParam("orderId");
    if(navigator.userAgent.toLowerCase().indexOf('micromessenger') == -1) {
      window.location.href = location.origin + "/wechat/pay/alipay?orderId=" + this.orderId;
    } else {
      wx.ready(function(){
        //批量隐藏功能
        wx.hideMenuItems({
          menuList: ['menuItem:share:weiboApp','menuItem:share:QZone','menuItem:share:email','menuItem:share:brand',
            'menuItem:copyUrl','menuItem:originPage','menuItem:editTag','menuItem:delete','menuItem:share:facebook',
            'menuItem:favorite','menuItem:share:qq','menuItem:share:appMessage','menuItem:share:timeline','menuItem:exposeArticle']
        });
      });
      let u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      this.isiOS = isiOS;
    }
  },
  methods: {
    toMyPage() {
      window.location.href = './index.html/#/user/my';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .alipay-wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: #F5F4F9;
    font-size:1rem;
  }
  .arrow{
    width: 5rem;
    height: 5rem;
    position: relative;
    top: 5px;
    right: 10px;
  }
  .tips{
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
    text-align: center;
    margin: 0 auto;
  }
  .div_btns {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-around;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 20px;
    padding-top: 1rem;
  }


  @media screen and (max-width:374px){
    .alipay-wrap {
      font-size: 14px;
    }
    .tips {
      margin-top: 2rem;
    }
    .browser {
      margin-top: 1rem;
    }
  }
  @media screen and (min-width:374px) and  (max-width: 414px){
    .alipay-wrap {
      font-size: 16px;
    }
    .tips {
      margin-top: 3rem;
    }
    .browser {
      margin-top: 2rem;
    }
    .div_btns {
      padding-top: 3rem;
    }
  }

</style>
