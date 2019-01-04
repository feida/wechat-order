<template>
  <div class="full-height electronic-apply">
    <div id="hasOrderInfo" class="orderList" v-iscroll >
      <ul>
        <li class="weui_type" v-for="item in orderList" :key="item.orderNumber">
          <div class="orderInfo">
            <p>订单号:<span style="margin-left: 5px;">{{item.orderNumber}}</span></p>
              <p>支付时间:<span style="margin-left: 5px;">{{new Date(item.payTime.time).format('yyyy-MM-dd hh:mm')}}</span></p>	
              <p style="margin-top: 3px;">
                <span>订单金额:<i style="margin-left: 5px;">￥{{item.orderMoney}}</i></span>	                    	
                <span style="margin-left: 10px;">可开票金额:<i style="margin-left: 5px;">￥{{item.receiptMoney}}</i></span>
              </p>
          </div>
          <div class="email-box">
            <button type="button" class="weui-btn weui-btn_mini weui-btn_primary email-btn" @click="gotoTitleApply(item)">申请开票</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import * as TYPE from '../../../../../../store/actionType/orderType.js'
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import { invoiceApi } from '../../../../../../fetch/api.js'
  export default {
    components: {
    },
    computed: {
      ...mapGetters([
        'customer',
        'shop',
        'receipt_type',  // 0:电子发票；1：纸质发票
        'defaultTitle'
      ]),
    },
    data() {
      return {
        orderList:[],  // 订单列表
      }
    },
    async created() {
      let ret = await invoiceApi.receiptOrderList($.param({customer_id: this.customer.id, shopId: this.shop.id})) || []
      this.orderList = ret.data
    },
    methods: {
      async gotoTitleApply(receipt) {
        // this.receipt = receipt
        this.$store.commit(TYPE.SET_ORDER_RECEIPT, receipt)        
        if (this.defaultTitle) {
          if (this.defaultTitle.type == 1) {
            this.$router.push({path: '/user/invoice/titleApply/applyCompany', query: {}})
          } else {
            this.$router.push({path: '/user/invoice/titleApply/applyPerson', query: {}})
          }
        } else {
            this.$router.push({path: '/user/invoice/titleApply/applyCompany', query: {}})          
        }
      }
    }
  }
</script>

<style lang="less">
.electronic-apply {
  .orderList {
    height: calc(100% - 50px); 
    overflow: hidden; 
    position: relative;
    li.weui_type {
      padding: 10px 15px;
      position: relative;
      display: flex;
      align-items: center;
      background-color: #fff;
      font-size: 0.9rem;
      &::before {
        border-top: 1px solid #dfdfdf;
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 15px;
        height: 1px;
        color: #D9D9D9;
        transform-origin: 0 0;
        transform: scaleY(0.5);
        left: 15px;
      } 
      &:nth-child(1)::before {
        border: none;
      }
      >div.orderInfo {
        flex: 70%;
      }
      >div.email-box {
        flex: 30%;
        // box-sizing: border-box;
        >button.email-btn {
          width: 80%;
          padding: 0;
          display: block;
          margin: 0 auto;
          background: #000;
          color: #fff;
        }
      }
    }
  }
}
</style>
