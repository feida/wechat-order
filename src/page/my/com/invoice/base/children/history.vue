<template>
  <div class="full-height invoice-history" v-iscroll>
    <ul>
      <li class="weui-cell weui-cell_access" style="padding: 12px;" v-for="item in orderList" :key="item.orderNumber">
        <div class="weui-cell__bd active">
          <p>订单号 : {{item.orderNumber}}</p>
          <p>支付时间 : {{new Date(item.payTime.time).format('yyyy-MM-dd hh:mm')}}</p>
          <p>
            <span>订单金额 : ￥{{item.orderMoney}}</span>
            <span style="margin-left: 15px;">开票金额 : ￥{{item.receiptMoney}}</span>
            <button type="button" v-if="receipt_type == 0" class="weui-btn weui-btn_mini weui-btn_primary email-btn" @click="sendEmail(item)">发送邮箱</button>
          </p>
        </div>
        <img class="billImg" v-if="item.state==0" src="../../../../../../assets/img/noBilling.png">
        <img class="billImg" v-if="item.state==1" src="../../../../../../assets/img/billing.png">
      </li>
    </ul>
    <!-- 弹出层 发送邮件组件 -->
    <SendEmail v-if="showSendEmail" :showSendEmail.sync="showSendEmail" :ticketId="ticketId"></SendEmail>
  </div>
</template>

<script>
  import { invoiceApi } from '../../../../../../fetch/api.js'
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import SendEmail from '../../com/sendEmail.vue'
  export default {
    components: {
      SendEmail
    },
    computed: {
      ...mapGetters([
        'customer',
        'shop',
        'receipt_type'
      ]),
    },
    data() {
      return {
        ticketId: null, // 选中发邮件的地址
        orderList:[],   // 订单列表
        showSendEmail: false, //是否显示发送邮件弹出框
      }
    },
    async created() {
      // let ret = await invoiceApi.receiptOrderList($.param({customer_id: this.customer.id, shopId: this.shop.id, state: 3})) || []
      let ret = await invoiceApi.receiptOrderList($.param({customer_id: this.customer.id, shopId: this.shop.id})) || []
      this.orderList = ret.data
    },
    methods: {
      // @Listener
      sendEmail(item) {
        this.showSendEmail = true;
        this.ticketId = item.id
      }
    }
  }
</script>

<style lang="less">
.invoice-history {
  background-color: rgb(248, 248, 248); 
  height: calc(100% - 50px); 
  overflow: hidden; 
  position: relative;
  li.weui-cell {
    background-color: #fff;
    div.weui-cell__bd.active {
      flex: 1;
      color: #bebebe;
      font-size: 0.9rem;
      button.email-btn {
        background-color: #000;
        float: right;
        padding: 0 5px;
      }
    }
    img.billImg {
      position: absolute;
      top: 8px;
      right: 15px;
      width: 3.8rem;
      height: 3rem;
    }
  }
}
</style>
