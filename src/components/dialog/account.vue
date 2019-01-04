<template lang="html">
  <div class="weui_dialog_confirm" v-if="accountShow">
    <div class="weui-mask" @click="close"></div>
    <div class="weui_dialog">
      <div class="full-height">
        <div class="header">
          <p style="padding:15px 10px 0px;text-align: center;">
            <span class="customer-account">￥{{customer.account.toFixed(2)}}</span>
            <span style="color:#999ba9;display:block;">账户余额</span>
          </p>
          <div class="attentionBtn">
            <span class="balanceBtn" @click="toRecharge">充值</span>
            <span class="scanBtn" style="margin-top: initial;" @click="toGetCash">提现</span>
          </div>
        </div>
        <!--流水明细-->
        <div id="scroll-wapper" v-iscroll=getIscroll>
          <div>
            <ul class="runningList">
              <li v-for="a in accountList">
                <a>
                  <span class="left" style="color: #EA7D1B;top: 10px;font-size: 18px;font-weight: bold;" v-if="a.paymentType==2">-{{a.money}}</span>
                  <span class="left" style="color: #00CC00;top: 10px;font-size: 18px;font-weight: bold;" v-if="a.paymentType==1">+{{a.money}}</span>
                  <span class="left" style="color: #66B3FF;top: 10px;font-size: 18px;font-weight: bold;" v-if="a.paymentType==3">{{a.money}}</span>
                  <span class="left" style="color: #66B3FF;top: 10px;font-size: 18px;font-weight: bold;" v-if="a.paymentType==4">{{a.money}}</span>
                  <span class="left">{{a.remark}}</span>
                  <span class="right">{{new Date(a.createTime.time).format("yyyy-MM-dd hh:mm")}}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { accountApi } from '../../fetch/api'

  export default {
    props: {
      customer:{
        type: Object
      },
      accountShow:{
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        accountList:[]
      }
    },
    created:function() {
      let _this = this;
      this.$watch("accountShow", function () {
        if (this.accountShow) {
          accountApi.account().then((response) => {
            _this.accountList = response.data.accountLogs;
            _this.resetDomHeight();
          });
        }
      })
    },
    methods:{
      close(){
        this.$emit('close-account',false);
      },
      toRecharge(){
        let that = this;
        this.$router.push({ path: '/user/recharge',query:{customerInfo:that.customer}});
      },
      toGetCash(){
        let that = this;
        this.$router.push({ path: '/user/getCash',query:{customerInfo:that.customer}});
      },
      getIscroll(iscroll){
        if (iscroll) {
          iscroll.on('scrollEnd', function() {
            console.log("scrollEnd");
          });
        }
      },
      resetDomHeight() {
        let mainHeight = $(".weui_dialog");
        let header = $(".header");
        let content = $("#scroll-wapper");
        content.height(mainHeight.height() - header.height());
      }
    }
  }
</script>

<style scoped>
  .header {
    border-bottom: 1px solid #d8d8d8;
  }
  #scroll-wapper {
    position: relative;
    overflow: hidden;
  }
  .customer-account {
    color:#df5548;
    font-size:1.6rem;
    display:block;
  }
  .attentionBtn {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-around;
    justify-content: space-around;
    margin: 0px 10px;
    padding: 15px 0px;
    text-align: center;
    font-size: 1.1rem;
  }
  .balanceBtn {
    width: 30%;
    border-radius: 5px;
    padding: 8px 5px;
    display: inline-block;
    background-color: #DF5548;
    color: #fff;
  }
  .scanBtn {
    width: 30%;
    border-radius: 5px;
    padding: 8px 5px;
    background-color: #fff;
    border: 1px solid #a5a2a2;
    color: #000;
    display: inline-block;
  }
  .runningList>li {
    height: 62px;
    padding-left: 50px;
    list-style: none;
    position: relative;
  }
  .runningList>li:before {
    content: "";
    display: block;
    position: absolute;
    left: 21px;
    top: 50%;
    width: 10px;
    height: 10px;
    background: #c81623;
    border-radius: 50%;
    margin-top: -7px;
  }
  .runningList>li>a {
    display: block;
    position: relative;
    height: 100%;
    padding-left: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .runningList>li>a>span.left:first-child {
    color: #EA7D1B;
    top: 10px;
    font-size: 18px;
    font-weight: bold;
  }
  .runningList>li>a>span.left {
    position: absolute;
    left: 0;
  }
  .runningList>li>a>span.right:nth-child(4), .runningList>li>a>span.left:nth-child(2) {
    bottom: 5px;
  }
  .runningList>li>a>span.right:nth-child(3) {
    top: 14px;
  }
  .runningList>li>a>span.right {
    position: absolute;
    right: 20px;
    font-size: 14px;
    color: #999;
  }
  .runningList>li:after {
    content: "";
    display: block;
    height: 100%;
    width: 2px;
    background: #c81623;
    position: absolute;
    left: 25.5px;
    top: 0;
  }
  .runningList li+li>a {
    border-top: 1px solid #d8d8d8;
  }
</style>
