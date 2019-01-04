<template>
  <!-- 订单备注 -->
  <div class="weui_dialog_confirm order-remark-box">
    <div class="weui_mask"></div>
    <div class="weui_dialog" style="max-height: 120vw;">
      <div class="full-height" style="font-family: 微软雅黑;border-radius: 10px;">
        <h2>订单备注</h2>
        <div class="remark_content">  
          <a href="javascript:;" class="weui-btn weui-btn_plain-default item-btn" v-for="item in orderRemarkList">{{item.txt}}</a>
        </div>
        <textarea class="remark_textarea" placeholder="其他备注(可不填)" rows="4" maxlength="30" v-model="remarkTxt"></textarea> 
        <span class="surplusText">{{remarkTxt.length}}/30</span> <a class="weui_btn_remark" @click="$emit('close', remarkTxt)">添加备注</a> 
      </div>
      <div class="dialog-close" @click="$emit('close', remarkTxt)"><i class="iconfont icon-jiaochacross80"></i></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      userRemarkTxt: {
        type: String,
      },
      orderRemarkList: {
        type: Array,
        default: () => [
            {txt: '多点醋'},
            {txt: '少点糖'},
            {txt: '少点糖'},
            {txt: '少点糖'},
            {txt: '少点糖'},
            {txt: '少点糖'},
            {txt: '少点糖'},
            {txt: '少点糖电击方块'},
            {txt: '少点糖'},
          ]
      }
    },
    created() {
      this.remarkTxt = this.userRemarkTxt;
    },
    data () {
      return {
        remarkTxt: '',
      }
    },
  };
</script>

<style scoped lang="less">
.order-remark-box {
  h2 {
    font-size: 1.5rem;
    height: 3rem;
    line-height: 3rem;
  }
  .weui-btn+.weui-btn {
    margin-top: 0;
  }
  >.weui_dialog {
    position: fixed;
    z-index: 1;
    width: 80%;
    height: auto;
    top: 5%;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    background: #fff;
    border-radius: 10px;
    .remark_content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 3%;
      position: relative;
      box-sizing: border-box;
      >.item-btn {
        width: 31%;
        font-size: 1rem;
        font-weight: 600;
        // margin-top: 8px;
        margin-bottom: 5px;
        padding-left: 8px;
        padding-right: 8px;
        border-radius: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.active {
          color: #fff;
          background-color: #000;
        }
      }
    }
    .remark_textarea {
      width: 91%;
      margin-top: 5px;
      margin-left: 4%;
      border: 1px solid #bababa;
      display: flex;
      resize: none;
      color: inherit;
      font-size: 1em;
      line-height: inherit;
      outline: 0;
      border-radius: 3px;
    }
    span.surplusText {
      font-size: 14px;
      position: absolute;
      right: 6%;
      color: #bdbdbd;
      bottom: 65px;
    }
    a.weui_btn_remark {
      margin: 4%;
      border-radius: 5px;
      text-align: center;
      line-height: 40px;
      display: block;
      flex: 1;
      font-size: 16px;
      bottom: 0px;
      width: 92%;
      background-color: #000;
      color: #fff;
      position: relative;
      border-radius: 5px;
    }
  }

  .weui_mask {
    position: fixed;
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .dialog-close {
    position: absolute;
    display: block;
    color: #fff;
    padding-top: 10px;
    width: 100%;
    z-index: 1;
    text-align: center;
    > i {
      font-size: 4em;
    }
  }
}
</style>
