<template>
  <div class="send-email">
    <div class="weui-mask"></div>
    <div class="weui-dialog" style="z-index:1000;">
      <div class="weui-dialog__hd"><strong class="weui-dialog__title">邮箱地址</strong></div>
      <div class="weui-dialog__bd">
        <div class="weui-cell">
          <div class="weui-cell__bd"><input class="weui-input" type="text" placeholder="请输入邮箱" v-model="emailStr"></div>
        </div>
        <div class="weui-dialog__ft">
          <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="$emit('update:showSendEmail', false)">取消</a>
          <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="sendEmail()">确定</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { invoiceApi } from '../../../../../fetch/api.js'
  export default {
    props: {
      showSendEmail: Boolean,
      ticketId: Number
    },
    data() {
      return {
        emailStr: ''
      }
    },
    methods: {
      // @Listener 
      async sendEmail() {
        try {
          let params = {
            emailStr: this.emailStr,
            ticketId: this.ticketId
          }
          if (this.emailStr.length == 0) {
            throw new Error('请输入邮箱')
          }
          let mailReg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
          if ( ! mailReg.test(this.emailStr)) {
            throw new Error('邮箱格式错误!')
          }
          let response = await invoiceApi.sendEmail($.param(params))
          if (response.success) {
            // todo 刷新页面
            // this.$emit('')
            this.$emit('update:showSendEmail', false)
            throw new Error('发送成功')
          } else {
            throw new Error('发送失败,请联系商家')
          }
        } catch(e) {
          this.$kiko_message({
            isShow: true,
            message: e.message,
            time: 2000,
            type: 2
          })
        }
      }
    }
  }
</script>

<style lang="less">
.send-email {
  >.weui-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  >.weui-dialog {
    position: fixed;
    z-index: 5000;
    width: 80%;
    max-width: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #FFFFFF;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
  }
}
</style>
