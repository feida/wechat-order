<template>
  <redPackage v-if="redDialogShow" 
    txt="完成注册即可领取"
    @close-redpackage="$emit('update:showRegister', false)"
    @open="redDialogShow=false">
  </redPackage>  <!--注册封面-->
  <CloseWrap v-else :dialogType="'register-welcome'" @close-dialog="$emit('update:showRegister', false)">
    <template slot="content">
      <div class="register-welcome full-height">
        <div class="appraise-item-div">
          <div class="reviewListPhotoBox"> <img :src="shop.photo"> </div>
          <div class="reviewListInfo">
            <div class="reviewListInfoTitle">
              <div class="avatar"> <img :src="appraiseInfo.headPhoto"> </div>
              <p> <span>{{appraiseInfo.nickName}}爱上了{{shop.name}}</span> </p>
              <div class="comment-rst"> <span>{{appraiseInfo.createTime && new Date(appraiseInfo.createTime.time).format('MM-dd hh:mm')}}</span> </div>
            </div>
            <div class="reviewListInfoContent">
              <p>{{appraiseInfo.content}}</p>
            </div>
          </div>
        </div>
        <!-- 点击分享链接进入 -->
        <a class="weui_btn_ShareRebate" v-if="from==='sharefriend' " @click.stop="toRegister">{{shareSetting.registerButton}}</a>  
        <!-- 未注册 -->
        <a class="weui_btn_ShareRebate" v-if="customer.isBindPhone==false" @click.stop="toRegister">立即注册</a>  
        <!-- 点击自己的推送 -->
        <div v-if="from==='share'">
          <div class="share-line">
            <div class="share-point"><i class="iconfont icon-fenxiang"></i></div>
          </div>
        </div>
      </div>
    </template>
  </CloseWrap>
</template>

<script>
import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
import CloseWrap from './wrap/close.vue'  // 弹出层抽象组件
import redPackage from '../../components/dialog/redpackage.vue'   //红包
import Utils from '../../utils/utils.js'
import { submitAppraise, wxConfigApi } from '../../fetch/api.js'
import wx from 'weixin-js-sdk'                                             // 微信sdk
export default {
  props: {
    appraiseid: {
      type: String|Number
    },
    showRegister: {
      type: Boolean
    }
  },
  components: {
    CloseWrap,
    redPackage
  },
  data() {
    return {
      redDialogShow: true,  // 显示封面
      shareSetting: {},
      appraiseInfo: {},
      from: 'share'         // share：微信推送进入；sharefriend：点击分享链接进入
    }
  },
  computed: {
    ...mapGetters([
      'customer',
      'shop',
      'brandSetting'
    ]),
  },
  async created() {
    try {
      // todo 这块逻辑可以放到 user.vue中做处理
      // let searchParam = sessionStorage.getItem('searchParam') || '';
      // if (searchParam === '') {
      //   return;
      // }
      // let searchParams = Utils.urlToObj(searchParam);
      // // 入口来源share|sharefriend
      // this.from = searchParams.dialog
      
      // // todo 纯二维码分享，没有appraiseId  我的页面中传递null，也没返回
      // let params = {appraiseId: searchParams.appraiseId}
      // let res = await submitAppraise.getShareDetailed($.param(params))
      // this.shareSetting = res.data.setting;
      // this.appraiseInfo = res.data.appraise;

      // if (this.from === 'share') {
      //   let shareSetting = this.shareSetting;
      //   let brandSetting = this.brandSetting;
      //   let host = this.brandSetting.data.wechatWelcomeUrl || 'http://dianji.restoplus.cn/index.html';
      //   let shareLink = host + "?shopId=" + this.appraiseInfo.shopDetailId + "&shareOrderId=" + this.appraiseInfo.orderId + "&shareCustomer=" + this.appraiseInfo.customerId + "&subpage=home&appraiseId=" + this.appraiseInfo.id + "&dialog=sharefriend&isShareLink=true";
      //   // 配置分享地址
      //   await Utils.wxConfig();
      //   wx.ready(function() {
      //     let param = {
      //       title: shareSetting.shareTitle,                     // 分享标题
      //       link:  shareLink,                                   // 分享链接
      //       imgUrl: shareSetting.shareIcon,                     // 分享图标
      //       success: function () { 
      //           // 用户确认分享后执行的回调函数
      //       },
      //       cancel: function () { 
      //           // 用户取消分享后执行的回调函数
      //       }
      //     }
      //     setTimeout(function() {
      //       //发送给朋友
      //       wx.onMenuShareAppMessage(param);
      //       // 分享到朋友圈
      //       wx.onMenuShareTimeline(param);
      //     }, 2000)
          
      //   }) 
      // }
    } catch(e) {
      alert(e.message)
    }
  },
  methods: {
    toRegister() {
      // alert(123)
      // this.$emit('to-register');
      if (this.customer.isBindPhone) {
        this.showRegisterWelcome = false;
        // 清除缓存
        sessionStorage.removeItem('searchParam');
        this.$kiko_message({
          isShow: true,
          message: '您已注册过!',
          time: 2000,
          type: 2
        })
      } else {
        this.$emit('update:showRegister', false);
        this.$router.push({ path: '/user/register'});
        // this.showRegisterWelcome = false;
        // this.redDialogShow = true;
        // this.showRegister = true;
      }
    }
  }
}
</script>

<style lang="less">
  .register-welcome.full-height {
    overflow: hidden;
    .appraise-item-div {
      .reviewListPhotoBox {
        img {
          border-radius: 10px 10px 0px 0px;
          height: 50vw;
          width: 100%;
          display: block;
        }
      }
      .reviewListInfo {
        position: relative;
        background: #f9f9f9;  
        >.reviewListInfoTitle {
          position: absolute;
          top: -2em;
          width: 100%;
          >.avatar {
            height: 3rem;
            width: 3rem;
            border: 5px solid #fff;
            border-radius: 50%;
            position: absolute;
            overflow: hidden;
            margin-left: 1rem;
            top: -3px;
          }
          >p {
            margin-top: 0px;
            text-align: left;
            font-size: 14px;
            background: rgba(0, 0, 0, 0.67);
            color: #fff;
            padding-left: 5.5rem;
            line-height: 2rem;
            // margin-top: -4px;
            white-space: nowrap;
          }
          >.comment-rst {
            padding-left: 5.5rem;
          }

        }
        >.reviewListInfoContent {
          padding-top: 1.8rem;
          padding-left: 1.2rem;
          text-align: left;
        }
      }
    }
    a.weui_btn_ShareRebate {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 10px;
      // margin: 10px;
      
      border-radius: 5px;
      // position: relative;
      background-color: #000;
      color: #fff;
      text-align: center;
      line-height: 35px;
      display: block;
      width: 90%;
      
    }
    .setting-content {
      padding: 0px 15px;
    }

    .share-line {
      height: 115vw;
      width: 22px;
      position: fixed;
      top: 21px;
      right: 19px;
      border-right: 1px solid #fff;
      border-bottom: 1px solid #fff;
      >.share-point {
        height: 20px;
        width: 40px;
        border: 1px solid #BBB;
        position: absolute;
        line-height: 20px;
        top: -20px;
        right: -20px;
        text-align: center;
        box-sizing: border-box;
        color: #fff;
      }
    }
  }

</style>
