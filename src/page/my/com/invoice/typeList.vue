<template>
  <!-- 发票类型 0电子 1纸质 -->
  <div class="weui_dialog_confirm invoice-type-list">
    <div class="weui_mask"></div>
    <div class="weui_dialog transparent choice-mode" style="top:35%;"> 
      <a class="weui_btn weui_btn_primary" style="width:50vw;margin:0 auto;" @click.stop="gotoInvoice(0)">电子发票</a> 
      <a class="weui_btn weui_btn_default" style="background-color: #868686;color: #fff;width:50vw;margin-left:0;margin-top: 15px;"  @click.stop="gotoInvoice(1)">纸质发票</a> 
    </div>
  </div>
</template>

<script>
  import * as TYPE from '../../../../store/actionType/orderType.js'
  export default {
    methods: {
      // @listener
      // 0:电子； 1：纸质
      gotoInvoice(type) {
        this.$store.commit(TYPE.SET_RECEIPT_TYPE, type)
        this.$router.push({path:'/user/invoice/titleList', query:{}})
      }
    }
  }
</script>

<style lang="less">
.invoice-type-list {
  .weui_mask {
    position: fixed;
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  >.weui_dialog {
    position: fixed;
    z-index: 1;
    width: 80%;
    top: 5%;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    background: #fff;
    border-radius: 10px;
    >.weui_btn {
      display: inline-block;
      padding: 1rem 2rem;
      border-radius: 3px;
      &.weui_btn_primary {
        background-color: #04BE02;
      }
    }

  }
  >.transparent {
    background: rgba(0,0,0,0);
  }

}
</style>
