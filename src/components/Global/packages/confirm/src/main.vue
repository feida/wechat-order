<template>
  <div class="weui_confirm_toast" v-if="isShow">
    <div class="weui_mask_transparent" style="background: rgba(0, 0, 0, 0.4);"></div>
    <div class="weui-dialog">
      <div class="weui-dialog__hd"><strong class="weui-dialog__title">购物车提示</strong></div>
      <div class="weui-dialog__bd">确定清空当前购物车吗?</div>
      <div class="weui-dialog__ft">
        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="closeToast">取消</a>
        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="confirm">确定</a>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import { mapGetters,mapMutations } from 'vuex'
  export default {
    name: 'kiko-confirm',
    data () {
      return {
        isShow: true
      }
    },
    methods:{
      closeToast() {
        this.isShow = false;
      },
      confirm() {
      }
    }
  }
</script>

<style>
  .weui_mask_transparent {
    position: fixed;
    z-index: 1001;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
</style>
