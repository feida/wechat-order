<template>
  <div class="weui_dialog_confirm sencond_mask recharge-wrap">
    <div class="weui_mask"></div>
    <div class="weui_dialog shadow">
      <div class="weui_dialog_hd"><h2 class="weui_dialog_title">充值列表</h2></div>
      <div class="weui-cells weui-cells_checkbox">
          <label @click="chargeId=(item.id)" ontouchend="click()" v-for="(item,key) in chargeList" class="weui-cell weui-check__label">
              <div class="weui-cell__bd">
                  <p>{{item.labelText}}</p>
              </div>
              <div class="weui-cell__hd">
                  <input type="radio" class="weui-check" name="checkbox1" v-model="chargeId" :value="item.id">
                  <i class="weui-icon-checked"></i>
              </div>
          </label>
      </div>
      <div class="weui_dialog_ft margin-top-0" @click="chargeWx">
        <a href="javascript:;" class="weui-btn weui-btn_plain-default primary">充值</a>
      </div>
      <div class="dialog-close" @click="closeRecharge"><i class="iconfont icon-jiaochacross80"></i></div>
    </div>
  </div>
</template>

<script>
  import { mapGetters,mapActions,mapMutations } from 'vuex'
  import { chargeWx } from '../../fetch/api.js'
  import Utils from '../../utils/utils.js'
  import wx from 'weixin-js-sdk'                                             // 微信sdk

  export default {
    props: {
      chargeList: {
        type: Array,
      }
    },
    data() {
      return {
        chargeId: null,
      }
    },
    computed: {
      ...mapGetters([
        'customer',
        'chargeDialog'
      ])
    },
    mounted(){
      this.chargeId = this.chargeList.length ? this.chargeList[0].id : "";
      //console.log(this.chargeId);
    },
    methods: {
      closeRecharge(){
        this.$store.commit('setCharge', false);
      },
      async chargeWx() {
        let that = this;
        let params = {
          settingId: this.chargeId,
          customerId: this.customer.id
        };
        // console.log(params);
        let result = await chargeWx.getChargeWx($.param(params))
        if (result.success) {
          var js_api_params = result.data;
          await Utils.wxConfigPay();
          wx.ready(function() {
            wx.chooseWXPay({
              timestamp : js_api_params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr : js_api_params.nonceStr, // 支付签名随机串，不长于 32 位
              "package" : js_api_params["package"], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType : js_api_params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign : js_api_params.paySign, // 支付签名
              success : function(res) {
                that.$store.commit('setCharge', false);
  //                  successCallback && successCallback();
              },
              cancel:function(){
  //                  cancelCbk && cancelCbk();
              },
              fail:function(res){
                alert("充值失败"+res.errMsg);
              }
            });
          })
        } else {
          alert(result.message);
        }
      },

    }
  }
</script>

<style scoped lang="less">
  .recharge-wrap {
    h2 {
      font-size: 1.5rem;
      height: 3rem;
      line-height: 3rem;
    }
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
      height: auto;
      top: 5%;
      left: 0;
      right: 0;
      margin: auto;
      text-align: center;
      background: #fff;
      border-radius: 10px;
      .weui_cell {
        border-bottom: 0;
        text-align: left;
      }
    }

    .weui-cells {
      margin-top: 0;
    }
    .weui_dialog_confirm .weui_dialog .weui_dialog_hd {
      padding: 5px 10px;
      border-bottom: 1px solid #e5e5e5;
      .weui_dialog_title {
        font-weight: 400;
        font-size: 17px;
      }
    }

    label.weui-cell {
      display: flex;
      justify-content: space-between;
      text-align: left;
    }
    .weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before {
      color: #000;
    }

    .weui_dialog_ft {
      line-height: 35px;
    }

    .weui_dialog_ft a.primary {
      background-color: #000;
      color: #fff;
      text-align: center;
      line-height: 35px;
    }

    .weui_dialog .weui_dialog_ft a {
      margin: 10px;
      border-radius: 5px;
      position: relative;
    }
    .dialog-close {
      position: absolute;
      display: block;
      color: #fff;
      padding-top: 10px;
      width: 100%;
      z-index: 1;
      text-align: center;
      > i {
        font-size: 4em;
      }
    }
  }
</style>
