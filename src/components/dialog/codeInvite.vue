<template lang="html">
  <!-- 邀请二维码 -->
  <div class="weui_dialog_confirm sencond_mask red_papper_invite" > 
    <div class="weui_mask" @click="close"></div> 
    <div class="weui_dialog red_bg" style="font-family:微软雅黑;z-index:17;" > 
      <div class="topcontent"> 
        <div class="red_avatar"> 
          <img :src="customer.headPhoto"> 
          <span class="close" @click="close">+</span> 
        </div> 
        <div class="red_name"> 
          <span class="text">{{customer.nickname}}</span> 
          <img class="customerSexSmallCode" src="../../assets/img/oldMan.png" v-if="customer.sex == 1" />
          <img class="customerSexSmallCode" src="../../assets/img/oldWoman.png" v-if="customer.sex == 2" />
        </div> 
        <span class="scanCode" style="margin-top:5px;">邀请朋友扫一扫,送他/她<i v-if="money>0">{{money}}元红包</i><i v-if="money==0">红包</i></span> 
        <span class="scanCode">朋友到店消费后,您将获得<i v-if="setting.minMoney>=0&&setting.maxMoney>0">{{setting.minMoney}}-{{setting.maxMoney}}元</i>返利</span> 
      </div> 
      <div class="posCode"> 
        <VueQrcode :value="shareLink" class="myCodeSrc"></VueQrcode>
        <span class="scanCodeMar" style="display:block;color:#fff;">已成功邀请<i>{{count}}</i>名好友到店消费</span> 
        <span style="display:block;color:#fff;">总计获得<i>{{sumMoney}}</i>元奖励</span> 
      </div> 
      </div> 
  </div>
</template>

<script>
  import { shopApi, submitAppraise, shareCountApi, registerCoupon } from '../../fetch/api'
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import VueQrcode from '@xkeshi/vue-qrcode';

  export default {
    props: {
      customer:{
        type: Object,
        default: {}
      },
      codeDialogShow:{
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        shareLink: '',          //二维码地址
        setting: {},            //最大 最小金额的配置
        money: 0,
        count: 0,
        sumMoney: 0
      }
    },
    computed: {
      ...mapGetters([
        // 'customer',
        'shop',
        'brandSetting',
      ]),

    },
    components: {
      VueQrcode  //qrcode
    },
    async created() {
      // 分享链接
      let host = this.brandSetting.data.wechatWelcomeUrl || 'http://dianji.restoplus.cn/index.html';
      this.shareLink = host + "?shopId=" + this.shop.id + "&shareCustomer=" + this.customer.id + "&subpage=home&dialog=share&isShareLink=true";
      
      // 奖励金范围
      let res = await shopApi.moduleSetting()
      var arr = res.toString().split(",");
      var flag = false;
      for (var i in arr) {
        if(arr[i] == 1) {
          flag = true;
        }
      }
      if (flag) {
        let result = await submitAppraise.getShareDetailed($.param({appraiseId: null}));
        // console.log(result, '7777777')
        if (result && result.setting && result.setting.isActivity == 1) {  // todo check 返回为空
          this.setting = result.setting;
        }
      }

      // 获取邀请返利的人数
      let result = await shareCountApi.share($.param({customerId: this.customer.id}))
      this.count = result.count;
      if (result.sumMoney != null) {
        this.sumMoney = result.sumMoney;
      }

      // 注册优惠券的钱
      let couponRes = await registerCoupon.coupon($.param({"couponType": "1"}))
      if (couponRes.success && couponRes.data.length > 0) {
        for(var i=0; i<couponRes.data.length; i++) {
          that.money += couponRes.data[i].couponValue * couponRes.data[i].couponNumber;
        }
      }
    },
    methods:{
      close() {
        this.$emit('update:codeDialogShow', false);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.red_papper_invite {
  text-align: center;
  >.weui_mask {
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
  }
  >.red_bg {
    background: #d55041;
    color: #ffb896;
    >.topcontent {
      height: 280px;
      border: 1px solid #df5548;
      background: #df5548;
      border-radius: 10px 10px 50% 50% e('/') 10px 10px 15% 15%;//less中斜杠 处理
      box-shadow: 0 2px 0 -1px rgba(0, 0, 0, 0.2);
      >.red_avatar {
        position: relative;
        >img {
          width: 80px;
          height: 80px;
          border: 1px solid #df5548;
          border-radius: 50%;
          overflow: hidden;
          margin-top: 5%;
        }
        >.close {
          color: rgba(0, 0, 0, 0.5);
          position: absolute;
          top: 5px;
          left: 15px;
          width: 2rem;
          height: 2rem;
          transform: rotate(45deg);
          font-size: 2rem;
        }
      }
      >.red_name {
        >.text {
          font-size: 1.2rem;
        }
        >.customerSexSmallCode {
          width: 1.1rem;
          height: 1.1rem;
          position: relative;
          top: 3px;
        }
      }
      >.scanCode {
        color: #fff;
        display: block;
        margin-bottom: 5px;
      }
    }
    >.posCode {
      >.myCodeSrc {
        border: 7px solid #dcbb85;
        width: 8rem;
        height: 8rem;
      }
      >.scanCodeMar {
        margin-top: 10px;
        i {
          font-style: normal;
        }
      }
    }
  }
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
}
</style>
