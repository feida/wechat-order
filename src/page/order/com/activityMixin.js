  import Utils from '../../../utils/utils'
  import { customerApi } from '../../../fetch/api.js'
  import wx from 'weixin-js-sdk'
  export default {
    // data或props中必须有activity属性
    // props: {
    //   activity: Object,
    // },
    data() {
      return {
        activity:{},			              //超级会员活动
        customerSvip: false,            //是否已经是付费会员
      }
    },
    async created() {
      await this.getActivity();
    },
    methods: {
      async getActivity() {
        let res = await customerApi.selectBanner();
        if (res.success) {
          this.activity = res.data;
        }
  
        res = await customerApi.getCustomerSvip();
        this.customerSvip = res.success;
      },
      /**
       * @param activityId 活动id
       */
      async chargeMemberNow(activityId) {
        let that = this;
        await Utils.wxConfig();

        let successCbk = () => {
          // 重新拉取数据
          that.getActivity();
          that.$emit('close');// 关闭弹出层
        }

        let errorCbk = () => {
          that.$kiko_message({
            isShow: true,
            message: '支付失败',
            time: 2000,
            type: 2
          })
        }

        let cancelCbk = cancelCbk

        wx.ready(async () => {
          let params = $.param({activityId: activityId})
          let result = await customerApi.svipChargeWx(params)
          if(result.success) {
              var js_api_params = result.data;
              console.log(js_api_params);
              wx.chooseWXPay({
                  timestamp : js_api_params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                  nonceStr : js_api_params.nonceStr, // 支付签名随机串，不长于 32 位
                  "package" : js_api_params["package"], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                  signType : js_api_params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  paySign : js_api_params.paySign, // 支付签名
                  success : function(res) {
                      successCbk && successCbk();
                  },
                  cancel:function(res){
                      cancelCbk&&cancelCbk();
                  },
                  fail:function(res){
                      alert("fail:"+res.errMsg);
                  },
                  error:function(res){
                      alert("error"+res);
                  }
              });
          } else {
              errorCbk && errorCbk(result.message);
          }
        });
      }
    }
  }