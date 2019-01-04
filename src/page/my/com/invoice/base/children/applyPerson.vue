<template>
  <div>    
    <div class="weui-form-preview__bd">
        <div class="weui-form-preview__item">
            <label class="weui-form-preview__label">订单号</label>
            <span class="weui-form-preview__value">{{receipt.orderNumber}}</span>
        </div>
        <div class="weui-form-preview__item">
            <label class="weui-form-preview__label">下单时间</label>
            <span class="weui-form-preview__value"> {{new Date(receipt.payTime.time).format('yyyy-MM-dd hh:mm')}}</span>
        </div>
        <div class="weui-form-preview__item">
            <label class="weui-form-preview__label">可开票金额</label>
            <span class="weui-form-preview__value">{{receipt.receiptMoney}}元</span>
        </div>
    </div>
    <CellItemEdit name="姓名" placeholder="姓名(必填)" :formData.sync="formData.name" :chooseTitle="true" @chooseTitle="chooseTitle"></CellItemEdit>
    <BottomButton name="申请发票" @clickBtn="applyInvoice"></BottomButton>
  </div>
</template>

<script>
import { invoiceApi } from '../../../../../../fetch/api.js'
import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
import CellItemEdit from '../../com/cell/itemEdit.vue'
import BottomButton from '../../../../../../components/dialog/wrap/bottom-button.vue'
import Mixin from './applyMixin.js'
export default {
  components: {
    CellItemEdit,
    BottomButton
  },
  mixins: [Mixin],
  data() {
    return {
      formData: {},
    }
  },
  computed: {
    ...mapGetters([
      'receipt',
      'receipt_type',  // 0:电子； 1：纸质
      'shop'
    ]),
  },
  created() {
    this.formData = this.$route.query.title || {}
  },
  methods: {
    // 容器  生产 消费,核心要素思考法
    chooseTitle() {
      this.$router.push({path: '/user/invoice/listPerson', query: {}})
    },
    // @Listener 
    // 申请发票
    async applyInvoice() {
      if (this.receipt_type == 0) {
        await this.applyElec(2)
      } else if (this.receipt_type == 1) {
        await this.applyPaper()
      }
    },
  }
}
</script>

<style>

</style>
