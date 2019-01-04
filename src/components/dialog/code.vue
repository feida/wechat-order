<template lang="html">
<!-- 暂时没地方用 -->
  <div class="weui_dialog_confirm" v-if="codeDialogShow">
  <div class="weui-mask" @click="close"></div>
  	<div class="weui_dialog">
    	<div class="full-height">
        <p style="border-bottom:1px solid #e6e6e6;padding:10px;">
          <span class="customerAccount">￥{{customer.account.toFixed(2)}}</span>
          <span class="accountWord">账户余额</span>
        </p>
        <p class="readyPay">店员扫描付款码完成支付</p>
        <img id="barcode"/>
        <!--<div><img class="myCode" src="" alt="二维码"/></div>-->
      </div>
  </div>
  </div>
</template>

<script>
  import { codeApi } from '../../fetch/api'

  export default {
    props: {
      customer:{
        type: Object,
        default: {}
      },
      codeDialogShow:{
        type: Boolean,
        default: false
      },
//      codeSrc:{
//        type: String,
//        default: ''
//      }
    },
    data () {
      return {
        codeSrc:null
      }
    },
    created:function() {
      let _this = this;
      this.$watch("codeDialogShow", function () {
        if (this.codeDialogShow) {
          let options = {
            format:"CODE128",
            displayValue:false,
          };
//        _this.codeSrc = codeApi.code() + this.customer.telephone + "&width=250&height=250";
          setTimeout(function () {
            $('#barcode').JsBarcode(_this.customer.telephone,options);
          },1000)
        }
      })
    },
    methods:{
      close(){
        this.$emit('close-dialog',false);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .customerAccount {
    color:#df5548;
    font-size:1.6rem;
    display:block;
  }
  .accountWord {
    color:#999ba9;
    display:block;
  }
  .readyPay {
    padding-top: 10px;
    color:#b3b2b2;
    font-size:1rem;
  }
  #barcode {
    width:82%;
    height:80px;
  }
  .myCode {
    width:55%;
    margin-top:10px;
  }
</style>
