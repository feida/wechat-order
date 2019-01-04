<template>
  <!-- 当前的叫号排列队伍 -->
  <CloseWrap  @close-dialog="$emit('closeOrdersQueue')">
  <div class="weui_dialog_confirm sencond_mask order-queue-wrap" slot="content">
    <!-- <div class="weui_mask"></div> -->
    <div class="weui_dialog shadow">
      <div class="weui_dialog_hd dialog-title">
        <!-- 订单状态 -->
        <div class="order-status">等待队列</div>
      </div>
      <!-- 等待的交易码 -->
      <div class="order-coder weui_dialog_hd">
        <span class="coder-num" :class="{active: orderId===item.id}" :key="item.id" v-for="(item,index) in queueList" v-if="index<=23">{{item.verCode}} </span>
        <!-- <span class="coder-num active">8617 </span> -->
      </div>
      <div class="weui_dialog_ft margin-top-0" > 
        您的前面还有{{queueList.length}}位在等待
      </div>
    </div>
  </div>
  </CloseWrap>
</template>

<script>
import { mapGetters,mapActions,mapMutations } from 'vuex'
import { orderStatus } from '../../../fetch/api.js'
import CloseWrap from "../../../components/dialog/wrap/close.vue";

export default {
  props: {
    // 当前自己的订单id
    orderId: {  
      type: String
    }
  },
  data() {
    return {
      queueList: [],  
      timerId: null     // 定时器id 
    }
  },
  computed: {
    ...mapGetters([
      'customer',
    ])
  },
  components: {
    CloseWrap
  },
  async created() {
    await this.getReadylistOrder();
    this.timerId = setInterval(() => {
      this.getReadylistOrder()
    }, 5000)
  },
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.timerId);
    this.timerId = null;
  },
  distroyed() {
    // 清除定时器
    clearInterval(this.timerId);
    this.timerId = null;
  },
  methods: {
    async getReadylistOrder() {
      let res = await orderStatus.readylistOrder($.param({orderId: null}))
      // console.log(JSON.stringify(res))
      if (res.success == true) {
        this.queueList = res.data;
      }
    }
  }
}
</script>

<style lang="less">
  .order-queue-wrap {
    .weui_dialog.shadow  {
      background-color: #000;
      color: #fff;
      // height: 70vh;
    }
    .weui_dialog_hd {
      padding: 5px 10px;
      // border-bottom: 1px solid #e5e5e5;
    }
    .dialog-title {
      position: relative;
      height: 30px;
      >.order-status {
        position: absolute;
        right: 0;
        top: 6px;
        font-size: 1.1rem;
        // color: #fff;
        // background-color: #000;
        color: #000;
        background-color: #fff;
        padding: 2px 6px 2px 4px;
        border-radius: 5px 0 0 5px;
      }
    }
    .order-coder {
      text-align: left;
      // border-bottom: none;
      display: flex;
      height: 70%;
      flex-direction: column;
      flex-wrap: wrap;
      // justify-content: flex-start;
      >.coder-num {
        width: 33.3333%;
        // color: #000;
        color: #fff;
        font-size: 1.5rem;
        text-align: center;
        &.active {
          color: #000;
          background-color: #fff;
        }
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
    .weui_dialog {
      // position: fixed;
      // z-index: 1;
      // width: 80%;
      // height: auto;
      // top: 5%;
      // left: 0;
      // right: 0;
      // margin: auto;
      // text-align: center;
      // background: #fff;
      // border-radius: 10px;
      .weui_cell {
        border-bottom: 0;
        text-align: left;
      }
    }

    .weui-cells {
      margin-top: 0;
    }
    .weui_dialog_confirm .weui_dialog .weui_dialog_hd {
      padding: 5px 10px;
      border-bottom: 1px solid #e5e5e5;
      .weui_dialog_title {
        font-weight: 400;
        font-size: 17px;
      }
    }

    label.weui-cell {
      display: flex;
      justify-content: space-between;
      text-align: left;
    }
    .weui-cells_checkbox .weui-check:checked+.weui-icon-checked:before {
      color: #000;
    }

    .weui_dialog_ft {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      line-height: 35px;
      display: flex;
      justify-content: space-around;
      // border-top: 1px solid #e5e5e5;
    }

    .weui_dialog_ft a.primary {
      flex: 1;
      margin: 6px;
      font-size: 1rem;
      background-color: #000;
      color: #fff;
      text-align: center;
      line-height: 35px;
    }

    .weui_dialog .weui_dialog_ft a {
      // margin: 10px;
      border-radius: 5px;
      position: relative;
    }
    .dialog-close {
      position: absolute;
      bottom: -6rem;
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
