<template>
  <transition name="fade">
    <div class="weui_loading_toast" v-if="isShow">
    <div class="weui_mask_transparent" @click="closeToast"></div>
    <div class="weui_toast">
      <img src="../../../../../assets/img/correctImg.png" class="msgImg" v-if="type && type == 1" />
      <img src="../../../../../assets/img/errorMsg.png" class="msgImg" v-if="type && type == 2" />
      <img src="../../../../../assets/img/loading.gif" class="msgImg" v-if="type && type == 3" />
      <p>{{message}}</p>
      </div>
    </div>
  </transition>
</template>

<script type="text/javascript">
  export default {
    name: 'kiko-message',
    props: {
      type: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        message: '加载中，请稍等...',
        time: 3000,
        isShow: true,
        // type: null,
        timer: null,//定时器id
      }
    },
    mounted () {
      this.close()
    },
    beforeDestroy() {
      window.clearTimeout(this.timer);
    },
    methods: {
      close () {
        let that = this;
        this.timer = window.setTimeout(function() {
          that.isShow = false
        }, this.time);
      },
      closeToast(){
        this.isShow = false;
      }
    }
  }
</script>

<style type="text/css">
  .weui_mask_transparent {
    position: fixed;
    z-index: 1001;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .weui_toast {
    position: fixed;
    min-height: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    top: 28%;
    width: 150px;
    height: 150px;
    z-index: 1002;
    background: rgba(40, 40, 40, 0.75);
    text-align: center;
    border-radius: 5px;
    color: #FFFFFF;
  }
  .weui_toast>p{
    padding: 0 10px;
    position: relative;
    top: 10px;
  }
  .msgImg {
    width: 50px;
    height: 50px;
    padding-top: 25px;
  }
  .fade-enter-active, .fade-leave-active {
    /* transition: opacity .5s */
    transition: opacity 0
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }
</style>
