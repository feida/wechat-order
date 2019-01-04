<template>
    <CloseWrap  @close-dialog="$emit('close-comments-share')">
      <div class="share-friend" slot="content" >
        <div class="full-height" >
          <div class="appraise-item-div">
            <div class="reviewListPhotoBox"> <img :src="shop.photo"> </div>
            <div class="reviewListInfo">
              <div class="reviewListInfoTitle">
                <div class="avatar"> <img :src="appraiseInfo.headPhoto"> </div>
                <p> <span>{{appraiseInfo.nickName}}爱上了{{shop.name}}</span> </p>
                <div class="comment-rst"> <span>{{appraiseInfo.createTime && new Date(appraiseInfo.createTime.time).format('MM-dd hh:mm')}}</span> </div>
              </div>
              <div class="reviewListInfoContent">
                <p>{{shareSetting.registerButton}}</p>
              </div>
            </div>
          </div>
          <div v-iscroll style="max-height:180px;overflow:hidden;" id="shareSetting">
            <div class="setting-content" v-html="shareSetting.dialogText">
          </div>
        </div>
      </div>
      <div>
        <div class="share-line">
          <div class="share-point"><i class="iconfont icon-fenxiang"></i></div>
        </div>
      </div>
      </div>
    </CloseWrap>
</template>

<script>
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import { wxConfigApi, chargeWx, submitAppraise } from '../../../fetch/api.js'
  import CloseWrap from "../../../components/dialog/wrap/close.vue";
  import Utils from '../../../utils/utils.js'
  import wx from 'weixin-js-sdk'
  export default {
    props: {
      orderId: {
        type: String
      }
    },
    data() {
      return {
        appraiseInfo: {}, // 评论的摘要信息
        shareSetting: {}
      }
    },
    components: {
      CloseWrap
    },
    computed: {
      ...mapGetters([
        'customer',
        'shop',       // 店铺设置
        'brandSetting' // 品牌设置
      ])
    },
    async created() {
      let params = {orderId: this.orderId};
      let appraiseRes = await submitAppraise.getAppraiseByOrderId($.param(params))//.then(appraiseRes => {
        if (appraiseRes.success === true) {
          // this.appraiseInfo = appraiseRes.data;
          params = {appraiseId: appraiseRes.data.id}
          let res = await submitAppraise.getShareDetailed($.param(params))//.then(res => {
          this.shareSetting = res.data.setting;
          this.appraiseInfo = res.data.appraise;

          let shareSetting = this.shareSetting;
          let brandSetting = this.brandSetting;
          let host = this.brandSetting.data.wechatWelcomeUrl || 'http://dianji.restoplus.cn/index.html';
          let shareLink = host + "?shopId=" + this.appraiseInfo.shopDetailId + "&shareOrderId=" + this.appraiseInfo.orderId + "&shareCustomer=" + this.appraiseInfo.customerId + "&subpage=home&appraiseId=" + this.appraiseInfo.id + "&dialog=sharefriend&isShareLink=true";
          // 配置分享地址
          await Utils.wxConfig()
          wx.ready(function() {
            let param = {
              title: shareSetting.shareTitle,                     // 分享标题
              link:  shareLink,                                   // 分享链接
              imgUrl: shareSetting.shareIcon,                     // 分享图标
              success: function () { 
                  // 用户确认分享后执行的回调函数
              },
              cancel: function () { 
                  // 用户取消分享后执行的回调函数
              }
            }
            setTimeout(function() {
              //发送给朋友
              wx.onMenuShareAppMessage(param);
              // 分享到朋友圈
              wx.onMenuShareTimeline(param);
            }, 2000)
          }) 
        }
    }

  }
</script>

<style lang="less">
.share-friend {
  // .weui_mask {
  //   position: fixed;
  //   z-index: 1;
  //   width: 100%;
  //   height: 100%;
  //   top: 0;
  //   left: 0;
  //   background: rgba(0, 0, 0, 0.6);
  // }
  // .share-dialog {
  //   top: 10%;
  // }
  // .meals-dialog.weui_dialog.dish_details {
  //   height: 120vw;
  // }
  .full-height {
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
    .setting-content {
      padding: 0px 15px;
    }
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
  .dialog-close {
    position: absolute;
    bottom: -80px;
    display: block;
    color: #fff;
    padding-top: 10px;
    width: 100%;
    z-index: 100;
    text-align: center;
  }
  .dialog-close i {
    font-size: 4em;
  }

}
</style>
