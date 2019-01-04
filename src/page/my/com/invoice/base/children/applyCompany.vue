<template>
  <div class="invoice-addCompany">
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
    <CellItemEdit name="发票抬头" placeholder="单位名称(必填)" maxlength="25" :formData.sync="formData.name" :chooseTitle="true" @chooseTitle="chooseTitle"></CellItemEdit>
    <CellItemEdit name="税号" placeholder="单位税号(必填)" :formData.sync="formData.dutyParagraph" maxlength="20"></CellItemEdit>
    <CellItemEdit name="单位地址" placeholder="单位地址"  :formData.sync="formData.companyAddress"></CellItemEdit>
    <CellItemEdit name="电话号码" placeholder="电话号码" :formData.sync="formData.mobileNo" maxlength="11"></CellItemEdit>
    <CellItemEdit name="开户银行" placeholder="开户银行名称" :formData.sync="formData.bankOfDeposit"></CellItemEdit>
    <CellItemEdit name="银行账户" placeholder="银行账户号码" maxlength="19" :formData.sync="formData.bankNumber"></CellItemEdit>

    <BottomButton name="申请发票" @clickBtn="applyInvoice"></BottomButton>
  </div>
</template>

<script>
  import { invoiceApi } from '../../../../../../fetch/api.js'
  import { mapState,mapGetters,mapActions,mapMutations } from 'vuex'
  import CellItemEdit from '../../com/cell/itemEdit.vue'
  import BottomButton from '../../../../../../components/dialog/wrap/bottom-button.vue'
  import listCompany from '../listCompany.vue'
  import Minxin from './applyMixin.js'
  
  export default {
    components: {
      CellItemEdit,
      BottomButton
    },
    mixins: [Minxin],
    data() {
      return {
        formData: {}, //选中的抬头信息
      }
    },
    computed: {
      ...mapGetters([
        'shop',
        'receipt_type',
        'receipt',        // 当前选中的发票订单信息
        'defaultTitle'
      ]),
    },
    created() {
      this.formData = this.$route.query.title || this.defaultTitle || {}
    },
    methods: {
      // 容器  生产 消费,核心要素思考法
      chooseTitle() {
        this.$router.push({path: '/user/invoice/listCompany', query: {}})
      },
      // @Listener 
      // 申请发票
      async applyInvoice() {
        if (this.receipt_type == 0) {
          await this.applyElec(1) // from mixin
        } else if (this.receipt_type == 1) {
          await this.applyPaper() // from mixin
        }
      },
    }
  }
</script>

<style lang="less">

</style>
