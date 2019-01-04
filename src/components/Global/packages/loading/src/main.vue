<template>
  <div class="weui_loading_toast" v-if="isShow">
    <div class="weui_mask_loading" @click="close"></div>
    <div class="weui_toast_loading">
      <img class="logoStyle" src="../../../../../assets/img/restowechat.png" />
      <div class="programContainer">
        <div class="progress">
          <div class="progress-bar"></div>
        </div>
      </div>
      <p style="font-size: 1rem;">加载中，请稍候</p>
      <p class="footTitle" style="bottom: 3rem;">Resto+</p>
      <p class="footTitle">技术服务热线:400-805-1711</p>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: 'kiko-loading',
    data () {
      return {
        isShow: true
      }
    },
//    mounted () {
//      this.close()
//    },
    methods: {
      close () {
        this.isShow = false
      }
    }
  }
</script>

<style type="text/css">
  .weui_mask_loading {
    position: fixed;
    z-index: 299;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #f2f2f2;
  }
  .weui_toast_loading {
    position: fixed;
    background: initial;
    width: 100%;
    height: 100%;
    top: 30%;
    left: 0;
    margin-left: 0;
    z-index: 300;
    min-height: 7.6em;
    text-align: center;
    border-radius: 5px;
  }
  .logoStyle {
    width: 6rem;
    height: 6rem;
    position: relative;
    top: -30px;
    border-radius: 50%;
  }
  .programContainer {
    left: 50%;
    position: absolute;
    top: 90px;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
  }
  .progress {
    background-color: #e5e9eb;
    height: 0.25em;
    position: relative;
    width: 9rem;
  }
  .progress-bar {
    background-image: linear-gradient(to right, #6D6D6D, #424141);
    background-image: -webkit-linear-gradient(to right, #6D6D6D, #424141);
    background-size: 9rem 0.25em;
    height: 100%;
    position: relative;
    animation: width 3.5s infinite;
    -moz-animation: width 3.5s infinite;
    -webkit-animation: width 3.5s infinite;
    -o-animation: width 3.5s infinite;
  }
  @keyframes width {
    0%, 100% {
      transition-timing-function: cubic-bezier(1, 0, 1, 0.85);
    }
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
  @-webkit-keyframes width {
    0%, 100% {
      transition-timing-function: cubic-bezier(1, 0, 1, 0.85);
    }
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
  .footTitle {
    position: fixed;
    font-size: 1rem;
    bottom: 1rem;
    text-align: center;
    width: 100%;
  }
</style>
