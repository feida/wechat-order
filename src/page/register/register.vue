<template lang="html">
  <div class="weui_dialog_confirm">
    <div class="weui-mask"></div>
    <div class="weui_dialog_record">

      <div class="scrollContent">
        <div>
        <!--品牌名称-->
        <div class="shopName">
          <div class="middle">
            <img :src="brandSetting.redPackageLogo||'../../assets/img/restowechat.png'" style="width: 4rem;height: 4rem;border-radius: 50%;"/>
            <p style="color: #fff;font-size: 1.2rem;">{{brandSetting.wechatBrandName}}</p>
          </div>
        </div>
        <!--注册-->
        <div style="margin:6% 5% 0 5%;">
          <div class="form-horizontal">
            <div style="font-size: 1rem;border-bottom: 1px solid #f0eff5;">
              <div class="weui-cell" style="border: 1px solid #F56D6D;">
                <div class="weui-cell__bd">
                  <input class="weui-input" id="phone-input" type="tel" v-model="phone" placeholder="请输入手机号" maxlength="11">
                </div>
              </div>
            </div>
            <div class="weui-cell weui-cell_vcode" style="font-size: 1rem;margin-top: 1.5em;background: #fff;border: 1px solid #F56D6D;">
              <div class="weui-cell__bd">
                <input class="weui-input" type="tel" id="password" placeholder="短信验证码" v-model="code">
              </div>
              <div class="weui-cell__ft">
                <button class="weui-vcode-btn codeBtn" style="font-size: 1rem;"
                        @click="getCode" :class="{disabled:remainTime>0}">{{remainTime||"获取验证码"}}</button>
              </div>
            </div>
          </div>
        </div>
        <!--注册优惠券-->
        <div style="margin:0 5%;">
          <div class="form-horizontal" style="position: relative;padding: 5px 10px" v-for="f in couponList">
            <img class="couponReg" src="../../assets/img/couponReg.png" alt="优惠券">
            <span class="couponName" style="font-size: 14px;">{{f.couponName}}</span>
            <span class="couponName" style="top: 13vw;">有效期至 {{endDate(f.couponValiday)}}</span>
            <span class="couponName" style="bottom: 6vw;top: inherit;">使用时间  : {{new Date(f.beginTime.time).format("hh:mm:ss")}}-{{new Date(f.endTime.time).format("hh:mm:ss")}}</span>
            <span class="coupon-money">{{f.couponValue}}<i style="font-size:14px;">元</i></span>
            <span class="couponMinMoney">堂吃满{{f.couponMinMoney}}元可使用</span>
          </div>
        </div>
      </div>
      </div>
      <!--注册领券-->
      <div id="weui_btn_coupon">
        <div class="middle">
          <button type="button" class="weui-btn weui-btn_primary"
                  @click="registerCoupon" style="background-color: #e74c3c;width: 84%;">注册领券</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { settingApi,registerCoupon,sendCode,editPhone } from '../../fetch/api'
  import Utils from '../../utils/utils.js'
  let iscrollObj = null;
  export default {
    data () {
      return {
        couponType: 0, 		/*优惠券的类型*/
        shareCustomer : null,     // 分享人
        shareOrderId: null,       // 分享订单id
        couponList: [],
        brandSetting:{},
        phone: null,
        code: null,
        rcode:null,
        remainTime: 0,
        phoneReg : /^((13[\d])|(15[0-35-9])|(18[\d])|(145)|(147)|(17[0135678]))\d{8}$/,
        codeReg : /^[0-9]{4}$/,
        getCodeBtn:true,
      }
    },
    computed: {

    },
    mounted(){
      // 处理分享链接逻辑
      let searchParam = sessionStorage.getItem('searchParam') || '';
      let fromParams = Utils.urlToObj(searchParam);
      // couponType -1:通用,0:新用户注册,1:邀请注册,2:生日,3:分享,4:实时
      if (fromParams.isShareLink ) {
        this.couponType = 3;
        this.shareCustomer = fromParams.shareCustomer;
        this.shareOrderId = fromParams.shareOrderId;
        sessionStorage.removeItem('searchParam');
      }

      let _this = this;
      let param = {
        couponType: _this.couponType
      }
      registerCoupon.coupon($.param(param)).then((response) => {
        for(var i=0;i<response.data.length;i++){
          let coupon = response.data[i];
          for(var j=0;j<coupon.couponNumber;j++){
            _this.couponList.push(coupon);
          }
        }
        console.log(JSON.stringify(_this.couponList));
      });
      settingApi.setting().then((response) => {
        _this.brandSetting = response.data;
      });
      this.$watch("getCodeBtn", function () {
        if (!this.getCodeBtn) {
          if (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
            $("#password").focus();
          }
        }
      });
    },
    methods:{
      endDate(tdData){
        let now = new Date();
        let time = now.getTime();
        time += 1000 * 60 * 60 * 24 * tdData;
        now.setTime(time);
        return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();;
      },
      cutRemainTime() {
        if (this.remainTime > 0) {
          this.remainTime--;
          let that = this;
          setTimeout(function () {
            that.cutRemainTime();
          }, 1000);
        }
      },
      getCode() {
        let that = this;
        let phone = $('#phone-input').val();
        if(!this.getCodeBtn){
          return;
        }
        if (this.remainTime > 0) {
          return;
        } else if (!this.phone) {
          this.$kiko_message({
            isShow:true,
            message: '手机号码为空',
            time: 2000,
            type:2
          })
          return;
        } else if(!(that.phoneReg.test(phone))) {
          this.$kiko_message({
            isShow:true,
            message: '手机号码格式错误',
            time: 2000,
            type:2
          })
          return;
        }
        this.getCodeBtn = false;
        let params = {
          phone: this.phone
        }
        sendCode.sendMes($.param(params)).then((response) => {
          if(response.success){     //发送成功
            that.getCodeBtn = true;
            localStorage.setItem("remainTime", Date.parse(new Date()));
            that.rcode = response.rcode;
            that.getCodeSuccess = true;
            that.remainTime = 60;
            that.cutRemainTime();
            sendCode.sendAliMes($.param(params)).then((res) => {
              if (res.success) {
                that.rcode = res.rcode;
              }
            })
          } else {    //发送失败
            that.phone = null;
            this.$kiko_message({
              isShow:true,
              message: response.message,
              time: 2000,
              type:2
            })
            that.getCodeBtn = true;
          }
        });
      },
      registerCoupon(){
        let that = this;
        if (!that.phone) {
          this.$kiko_message({
            isShow:true,
            message: '手机号码为空',
            time: 2000,
            type:2
          })
          return;
        }else if(!(that.phoneReg.test(that.phone))) {
          this.$kiko_message({
            isShow:true,
            message: '手机号码格式错误',
            time: 2000,
            type:2
          })
          return;
        }else if(!that.code){
          this.$kiko_message({
            isShow:true,
            message: '请输入验证码',
            time: 2000,
            type:2
          })
          return;
        }else if(!that.codeReg.test(that.code)) {
          this.$kiko_message({
            isShow:true,
            message: '验证码格式错误',
            time: 2000,
            type:2
          })
          return;
        }else if(that.code != this.rcode){
          this.$kiko_message({
            isShow:true,
            message: '验证码错误',
            time: 2000,
            type:2
          })
          return;
        }else{
          let param = {
            code : this.code,
            phone : this.phone,
            rcode : this.rcode,
            couponType : this.couponType,
            shareCustomer : this.shareCustomer,
            shareOrderId: this.shareOrderId
          }
          editPhone.bind($.param(param)).then((res) => {
            if(res.success){
              that.$store.dispatch('getCustomer', {code: 'test'});
              this.$router.push({ path: '/user/my'});
            }else {
              this.$kiko_message({
                isShow:true,
                message: res.messages,
                time: 2000,
                type:2
              })
            }
          });
        }
      }
    }
  }
</script>

<style scoped>
  .scrollContent {
    position: relative;
    overflow: hidden;
    height: 86%;
    overflow-y: scroll;
  }
  .weui_dialog_record {
    position: fixed;
    z-index: 1000;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    background: #fff;
  }
  .shopName {
    position: relative;
    height: 8rem;
    background-color: #e74c3c;
    border-radius: 0 0 200% 200%;
    display: table;
    width: 100%;
    text-align: center;
  }
  .middle {
    vertical-align: middle;
    display: table-cell;
  }
  .form-horizontal {
    background-color: #fff;
    padding: 10px;
    font-size: 12px;
  }
  .weui-vcode-btn {
    width: 110px;
  }
  .weui-vcode-btn.codeBtn {
    background: #e74c3c;
    color: #fff;
  }
  .weui-vcode-btn.disabled {
    background-color: #bbb;
  }
  .couponName {
    position: absolute;
    top: 5vw;
    left: 40px;
    color: #fff;
  }
  .coupon-money {
    position: absolute;
    top: 6vw;
    right: 44px;
    font-size: 30px;
    color: #333;
  }
  .couponMinMoney {
    position: absolute;
    right: 20px;
    bottom: 6vw;
    color: #999;
    font-size: 11px;
  }
  #weui_btn_coupon {
    position: relative;
    height: 14%;
    width: 100%;
    bottom: 0;
    background-color: #fff;
    display: table;
  }
</style>
