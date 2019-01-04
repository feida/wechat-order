<template lang="html">
  <div class="weui_dialog_confirm">
    <div class="weui-mask"></div>
    <div class="weui_dialog_recharge">
      <div class="main-content" v-if="!cashIng">
        <div class="header">
          <div class="weui_charge">
            <span>提现金额</span>
            <input type="tel" id="chargeText" style="border-bottom: 1px solid #dcdcdc;width: 100%;" v-model="cash" />
            <p style="padding: 10px 0px;" v-if="!cash || (cash && cash<=canUsedCash)">
              <span style="text-align: left;color: #a2a2a2;">可提现金额 ￥ {{canUsedCash}}</span>
              <span class="allCash">全部提现</span>
            </p>
            <p style="padding: 10px 0px;" v-else>
              <span style="text-align: left;color: #e2543c;">输入金额超过余额</span>
            </p>
          </div>
          <p style="color: #bababb;">提现金额会原路返回至您的支付账户</p>
          <div style="padding: 10px 0 25px;">
            <button class="btn" @click="getCashMoney" v-if="clickState">提现</button>
            <button class="btn active" v-else disabled="disabled">提现</button>
          </div>
        </div>
      </div>
      <!--提现成功-->
      <div class="main-content" v-else>
        <div style="position: relative;top: 6%;">
          <img src="../../assets/img/chargeSuccess.png" style="width: 7rem;height: 7rem;"/>
          <p style="font-size: 22px;margin-top: 15px;font-weight: bold;">提现成功</p>
        </div>
        <p class="weui_money">
          <span style="color: #676767;">提现金额</span>
          <span style="float: right;">￥{{cash}}</span>
        </p>
        <p class="weui_money" style="border-bottom: none;">
          <span style="color: #676767;">账户余额</span>
          <span style="float: right;color: #e2543c;">￥{{accountBalance.toFixed(2)}}</span>
        </p>
        <p class="twoHours">预计2小时内到账</p>
        <button class="eatMore" @click="alReadyCash">完成</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { remainApi,getCashApi } from '../../fetch/api'

  export default {
    data () {
      return {
        customerInfo:{},
        cashIng:false,
        cash:null,
        accountBalance:null,
        btnFlag:true,
        canUsedCash:null
      }
    },
    watch:{
      'cash':function(newVal,oldVal){
        if(newVal){
          if (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
            $("#chargeText").focus();
          }
        }
      }
    },
    computed:{
      clickState(){
        let that = this;
        if(this.cash != null && this.cash != '' && this.cash != 0 && this.cash <= that.canUsedCash){
          return true;
        }else if(this.cash == null || this.cash == ''){
          return false;
        }
      }
    },
    created(){
      let _this = this;
      if (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
        $("#chargeText").focus()
      }
      this.customerInfo = this.$route.query.customerInfo;
      remainApi.remain().then((response) => {
        _this.canUsedCash = 2;
      });
    },
    methods:{
      goToEat(){
        this.$router.push({ path: '/user/order'});
      },
      getCashMoney(){
        let _this = this;
        if(!_this.btnFlag){
          return;
        }
        _this.btnFlag = false;
        setTimeout(function(){//三秒后才能再次点击
          _this.btnFlag = true;
        },3000);
        if(this.cash == null || this.cash == ''){
            alert("请输入提取金额");
//          that.showAlter("请输入提取金额",2, 3000);
          return;
        }
        let param = {
          money:this.cash,
          customerId:this.customerInfo.id
        };
        getCashApi.getCash($.param(param)).then((response) => {
          if(response.success){
            _this.cashIng = true;
            _this.accountBalance = parseFloat(_this.canUsedCash)-parseFloat(_this.cash);
          }
        });
      },
      alReadyCash(){
        this.$router.push({ path: '/user/my'});
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/cash.css';
</style>
