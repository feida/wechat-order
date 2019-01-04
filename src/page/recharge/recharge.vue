<template lang="html">
  <div class="weui_dialog_confirm">
    <div class="weui-mask"></div>
    <div class="weui_dialog_recharge">
      <div class="main-content" v-if="chargeIng">
        <div class="mainInfo">
          <p class="chargeNow">没钱买好吃的了,赶紧充值吧~</p>
          <p class="weui_charge">
            <span style="vertical-align: middle;">账户余额:</span>
            <span style="float: right;color: #e2543c;font-weight: bold;font-size: 1.2rem;">￥{{customerInfo.remain}}</span>
          </p>
          <p class="weui_charge" style="padding-bottom: 5px;">
            <span>快捷充值:</span>
          </p>
          <div class="accountBtn">
					<span class="balanceBtn" @click="choiceChargeMoney(c)"
                :class="{active:choiceSort == c.sort}" v-for="c in chargeList">{{c.value}}元</span>
          </div>
          <p class="weui_charge" style="padding-top: 5px;">
            <span>充值金额:</span>
            <input type="tel" id="chargeText" placeholder="请输入充值金额" onfocus="this.placeholder=''"
                   onblur="this.placeholder='请输入充值金额'" style="border-bottom: 1px solid #dcdcdc;" v-model="money"  />
          </p>
          <div>
            <button class="btn" @click="chargeMoney">充值</button>
            <p style="color: #a5a6a9;padding: 5px;">充值金额可随时提现</p>
          </div>
        </div>
      </div>
      <!--充值成功-->
      <div class="main-content" v-else>
        <div style="position: relative;top: 6%;">
          <img src="../../assets/img/chargeSuccess.png" style="width: 7rem;height: 7rem;"/>
          <p class="chargeSuccessful">充值成功</p>
        </div>
        <p class="weui_money">
          <span style="color: #676767;">充值金额</span>
          <span style="float: right;">￥12</span>
        </p>
        <p class="weui_money" style="border-bottom: none;">
          <span style="color: #676767;">账户余额</span>
          <span style="float: right;color: #e2543c;">￥80</span>
        </p>
        <button class="eatMore" @click="goToEat">前往点餐</button>
        <button class="continuebtn" @click="continueCharge">继续充值</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { customerApi } from '../../fetch/api'

  export default {
    data () {
      return {
        customerInfo:{},
        choiceSort:null,
        money:null,
        chargeIng:true,
        chargeList:[
          {
            sort:1,
            value:50
          },
          {
            sort:2,
            value:100
          },
          {
            sort:3,
            value:200
          },
          {
            sort:4,
            value:500
          }
        ]
      }
    },
    created(){
      this.customerInfo = this.$route.query.customerInfo;
    },
    methods:{
      choiceChargeMoney(c){
        this.choiceSort = c.sort;
      },
      chargeMoney(){
        this.chargeIng = false;
      },
      continueCharge(){
        this.chargeIng = true;
      },
      goToEat(){
        this.$router.push({ path: '/user/order'});
      }
    }
  }
</script>

<style scoped>
  @import '../../assets/css/recharge.css';
</style>
